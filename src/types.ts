export enum Category {
  ELECTRIC = '전기',
  MECHANICAL = '기계',
  CHEMICAL = '시약',
  CONSUMABLE = '소모품',
  ETC = '기타'
}

export interface InventoryItem {
  id: string; // 고유 ID (예: "ITEM-0001")
  name: string; // 품명
  category: string; // 대분류
  spec: string; // 규격
  unit: string; // 단위
  currentStock: number; // 현재 재고
  optimalStock: number; // 적정 재고
  purchasePrice?: number; // 구매 단가 (선택)
  supplier?: string; // 공급업체 (선택)
  location: string; // 보관 장소
  lastTransactionDate?: string; // 최종 거래일 (ISO 문자열)
  memo?: string; // 메모
  manufacturer?: string; // 제조사
}

export interface InventoryTransaction {
  id: string; // 고유 ID (예: "TX-0001")
  itemId: string; // 관련 재고 항목 ID
  type: 'IN' | 'OUT'; // 입고 또는 출고
  quantity: number; // 수량
  date: string; // 거래 날짜 (ISO 문자열)
  price?: number; // 거래 단가
  site: string; // 사용 현장
  user: string; // 담당자 이름
  currentStockSnapshot: number; // 거래 후 재고 스냅샷
  description?: string; // 비고
}

export interface User {
  id: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
}

export type ViewState = 'DASHBOARD' | 'INVENTORY' | 'ANALYSIS' | 'IMPORT' | 'HISTORY_IMPORT';

// [BUG FIX] Add the missing AppData type definition
export interface AppData {
  dbVersion?: string;
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  users: User[];
  sites: string[];
  locations: string[];
}
