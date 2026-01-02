import { InventoryTransaction } from './types';

export const INITIAL_TRANSACTIONS: InventoryTransaction[] = [
  // For INV-002: "언더웨어(팬티형) 대형(L)"
  {
    id: "TX-002-20250520-OUT",
    itemId: "INV-002",
    itemName: "언더웨어(팬티형) 대형(L)",
    category: "위생용품",
    date: "2025-05-20",
    type: "OUT",
    quantity: 1.2,
    worker: "간호팀",
    department: "간호팀",
    reason: "현장사용",
    currentStockSnapshot: 5.8 
  },
  {
    id: "TX-002-20250523-OUT",
    itemId: "INV-002",
    itemName: "언더웨어(팬티형) 대형(L)",
    category: "위생용품",
    date: "2025-05-23",
    type: "OUT",
    quantity: 2.8,
    worker: "요양팀",
    department: "요양팀",
    reason: "현장사용",
    currentStockSnapshot: 3.0 
  },
  {
    id: "TX-002-20250605-IN",
    itemId: "INV-002",
    itemName: "언더웨어(팬티형) 대형(L)",
    category: "위생용품",
    date: "2025-06-05",
    type: "IN",
    quantity: 3.0,
    worker: "관리자",
    department: "관리팀",
    reason: "구매입고",
    currentStockSnapshot: 6.0 
  },
  {
    id: "TX-002-20250610-OUT",
    itemId: "INV-002",
    itemName: "언더웨어(팬티형) 대형(L)",
    category: "위생용품",
    date: "2025-06-10",
    type: "OUT",
    quantity: 2.5,
    worker: "복지팀",
    department: "복지팀",
    reason: "현장사용",
    currentStockSnapshot: 3.5 
  },
  {
    id: "TX-002-20250701-IN",
    itemId: "INV-002",
    itemName: "언더웨어(팬티형) 대형(L)",
    category: "위생용품",
    date: "2025-07-01",
    type: "IN",
    quantity: 1.0,
    worker: "관리자",
    department: "관리팀",
    reason: "구매입고",
    currentStockSnapshot: 4.5 
  },
  {
    id: "TX-002-20250715-OUT",
    itemId: "INV-002",
    itemName: "언더웨어(팬티형) 대형(L)",
    category: "위생용품",
    date: "2025-07-15",
    type: "OUT",
    quantity: 1.0,
    worker: "요양팀",
    department: "요양팀",
    reason: "현장사용",
    currentStockSnapshot: 3.5 
  },
  {
    id: "TX-002-20250801-OUT",
    itemId: "INV-002",
    itemName: "언더웨어(팬티형) 대형(L)",
    category: "위생용품",
    date: "2025-08-01",
    type: "OUT",
    quantity: 1.7,
    worker: "요양팀",
    department: "요양팀",
    reason: "현장사용",
    currentStockSnapshot: 1.8 
  },
  
  // For INV-001: "언더웨어(팬티형) 특대형" (User Scenario: March IN 1, April OUT 1)
  {
    id: "TX-001-20250305-IN",
    itemId: "INV-001",
    itemName: "언더웨어(팬티형) 특대형",
    category: "위생용품",
    date: "2025-03-05",
    type: "IN",
    quantity: 1.0,
    worker: "관리자",
    department: "관리팀",
    reason: "구매입고",
    currentStockSnapshot: 1.0 
  },
  {
    id: "TX-001-20250410-OUT",
    itemId: "INV-001",
    itemName: "언더웨어(팬티형) 특대형",
    category: "위생용품",
    date: "2025-04-10",
    type: "OUT",
    quantity: 1.0,
    worker: "간호팀",
    department: "간호팀",
    reason: "현장사용",
    currentStockSnapshot: 0.0 
  },
];