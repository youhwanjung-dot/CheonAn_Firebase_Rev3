export enum Category {
  ELECTRIC = '전기자재',
  MEASURE = '계측기',
  TOOLS = '공구류',
  SAFETY = '안전용품',
  OFFICE = '사무용품',
  ETC = '기타'
}

export interface InventoryItem {
  id: string;
  category: string;      // 대분류
  name: string;          // 품목명 - 예: MCCB 배선용차단기
  standard: string;      // 규격 - 예: 630A 4P (괄호 안 내용 분리)
  model: string;         // 품번(비고) - 예: ABS 604C
  manufacturer: string;  // 제조사 - 예: LS, 현대
  unit: string;          // 관리단위 - 예: EA, Set
  currentStock: number;  // 재고
  safeStock: number;     // 적정재고
  location: string;      // 보관장소
  note?: string;         // 기타사항
  lastUpdated: string;   // 최종수정일
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  date: string; 
  type: 'IN' | 'OUT'; 
  quantity: number;
  worker: string; 
  department: string; 
  reason: string; 
  currentStockSnapshot: number; 
}

export type ViewState = 'DASHBOARD' | 'INVENTORY' | 'ANALYSIS' | 'IMPORT' | 'HISTORY_IMPORT';

export interface DashboardStats {
  totalItems: number;
  lowStockCount: number;
  totalCategories: number;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;      
  name: string;    
  password: string; 
  role: UserRole;
}