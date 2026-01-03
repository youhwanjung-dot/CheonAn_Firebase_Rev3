
import express from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

// Define the shape of our data to avoid using 'any'
interface DbData {
    inventory: Record<string, unknown>[];
    transactions: Record<string, unknown>[];
    users: Record<string, unknown>[];
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dbPath = path.join(__dirname, 'db.json');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Helper functions to read/write from/to db.json
const readDB = (): DbData => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ inventory: [], transactions: [], users: [] }));
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data) as DbData;
};

const writeDB = (data: DbData) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// WebSocket connection handling
const clients = new Set<WebSocket>();
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// Function to broadcast messages to all clients
const broadcast = (message: string) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};


// --- API Endpoints ---

// Inventory
app.get('/api/inventory', (req, res) => {
  const db = readDB();
  res.json(db.inventory);
});

app.post('/api/inventory', (req, res) => {
  const db = readDB();
  db.inventory = req.body;
  writeDB(db);
  broadcast('data-updated');
  res.status(200).send({ message: 'Inventory updated' });
});

// Transactions
app.get('/api/transactions', (req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

app.post('/api/transactions', (req, res) => {
  const db = readDB();
  db.transactions = req.body;
  writeDB(db);
  broadcast('data-updated');
  res.status(200).send({ message: 'Transactions updated' });
});

// Users
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.post('/api/users', (req, res) => {
  const db = readDB();
  db.users = req.body;
  writeDB(db);
  broadcast('data-updated');
  res.status(200).send({ message: 'Users updated' });
});


const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

