
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import os from 'os'; // OS 모듈 추가
import { INITIAL_INVENTORY, INITIAL_TRANSACTIONS, INITIAL_USERS } from './src/constants';
import type { InventoryItem, InventoryTransaction, User } from './src/types';

// Define the shape of our data with specific types
interface DbData {
    inventory: InventoryItem[];
    transactions: InventoryTransaction[];
    users: User[];
}

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// --- 시작: 데이터베이스 경로 수정 로직 ---

/**
 * 운영체제에 맞는 앱 데이터 저장 폴더 경로를 반환합니다.
 * 이 폴더는 사용자 데이터를 저장하기 위한 표준 위치입니다.
 * @returns {string} 앱 데이터 폴더의 절대 경로
 */
const getAppDataDir = () => {
    // tauri.conf.json의 productName 또는 identifier를 사용하는 것이 좋습니다.
    const appName = "cheonan-sujil-inventory";
    switch (process.platform) {
        case 'win32': // Windows
            // APPDATA 환경 변수가 없는 경우를 대비해 홈 디렉토리를 예비로 사용
            return path.join(process.env.APPDATA || os.homedir(), appName);
        case 'darwin': // macOS
            return path.join(os.homedir(), 'Library', 'Application Support', appName);
        default: // Linux 등 기타
            return path.join(os.homedir(), '.config', appName);
    }
};

const appDataDir = getAppDataDir();

// 앱 데이터 폴더가 존재하는지 확인하고, 없으면 생성합니다.
if (!fs.existsSync(appDataDir)) {
    fs.mkdirSync(appDataDir, { recursive: true });
    console.log(`앱 데이터 폴더 생성 완료: ${appDataDir}`);
}

// 최종 데이터베이스 파일 경로 (사용자 데이터 폴더 내)
const dbPath = path.join(appDataDir, 'database.json');
console.log(`데이터베이스 경로 설정 완료: ${dbPath}`);

/*
// --- 기존 데이터베이스 경로 로직 (주석 처리) ---
// 아래 로직은 개발 환경에서는 동작하지만, 실제 배포된 앱에서는
// 현재 작업 디렉토리(process.cwd())가 예상과 달라 문제를 일으킵니다.
const dbPath = path.join(process.cwd(), 'database.json');
*/

// --- 종료: 데이터베이스 경로 수정 로직 ---


// API routes
const readData = (): DbData => {
    if (!fs.existsSync(dbPath)) {
        console.log('database.json 파일을 찾을 수 없어, 초기 데이터로 새로 생성합니다.');
        const initialData: DbData = {
            inventory: INITIAL_INVENTORY as InventoryItem[],
            transactions: INITIAL_TRANSACTIONS as InventoryTransaction[],
            users: INITIAL_USERS as User[]
        };
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
    }
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        try {
            const parsedData = JSON.parse(data) as DbData;
            if (Array.isArray(parsedData.inventory) && Array.isArray(parsedData.transactions) && Array.isArray(parsedData.users)) {
                return parsedData;
            }
            throw new Error('저장된 database.json의 데이터 구조가 올바르지 않습니다.');
        } catch (parseError) {
            console.error("치명적 오류: database.json 파일 분석에 실패했거나 데이터가 손상되었습니다.", parseError);
            throw new Error('database.json 파일 분석 실패');
        }
    } catch (readError) {
        console.error("치명적 오류: database.json 파일 읽기에 실패했습니다.", readError);
        throw new Error('database.json 파일 읽기 실패');
    }
};

const writeData = (data: DbData) => {
    if (data && Array.isArray(data.inventory) && Array.isArray(data.transactions) && Array.isArray(data.users)) {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } else {
        console.error('잘못된 형식의 데이터를 database.json에 쓰려고 시도했습니다. 쓰기 작업을 중단합니다.');
    }
};

app.get('/api/data', (_req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        console.error("/api/data 엔드포인트 오류:", errorMessage);
        res.status(500).json({ message: "데이터 읽기 중 오류 발생", error: errorMessage });
    }
});

app.post('/api/data', (req, res) => {
    try {
        const newData = req.body as DbData;
        if (newData && Array.isArray(newData.inventory) && Array.isArray(newData.transactions) && Array.isArray(newData.users)) {
            writeData(newData);
            res.status(200).json({ message: '데이터를 성공적으로 저장했습니다.' });
        } else {
            res.status(400).json({ message: '제공된 데이터 형식이 올바르지 않습니다.' });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        res.status(500).json({ message: "데이터 저장 중 오류 발생", error: errorMessage });
    }
});

// Serve frontend in production
if (isProduction) {
    const clientBuildPath = path.resolve(__dirname, '..', 'dist');
    app.use(express.static(clientBuildPath));
    app.get('*', (_req, res) => {
        res.sendFile(path.resolve(clientBuildPath, 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    if(isProduction) {
        console.log('프로덕션 모드로 실행 중입니다. dist 폴더의 정적 파일을 제공합니다.');
    }
});
