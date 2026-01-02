import { InventoryItem, User, InventoryTransaction } from './types';
import { initialData } from './initialData';
import { INITIAL_TRANSACTIONS as initialTxData } from './initialTransactions'; 

export const APP_VERSION = '3.5.0';
export const BUILD_DATE = new Date().toISOString().slice(0, 10);

export const INITIAL_INVENTORY: InventoryItem[] = initialData;
export const INITIAL_TRANSACTIONS: InventoryTransaction[] = initialTxData; 

export const INITIAL_USERS: User[] = [
  { id: 'admin', name: '관리자', password: '1234', role: 'admin' },
  { id: 'jyh', name: '정유환', password: '1234', role: 'admin' },
  { id: 'ksj', name: '강석진', password: '1234', role: 'user' },
  { id: 'lyh', name: '이용훈', password: '1234', role: 'user' },
  { id: 'lsh', name: '이석호', password: '1234', role: 'user' },
];

export const FIELD_SETTINGS_KEY = 'cheonan_field_settings_v2';

// Storage location default values
export const DEFAULT_LOCATIONS: string[] = [
  '전기실 창고',
  '탈수동 창고',
  '분뇨동 창고',
  '관리동 1층',
];

export interface FieldDef {
  key: keyof Omit<InventoryItem, 'id' | 'lastUpdated'>;
  label: string;
  required: boolean;
}

export const DEFAULT_DB_FIELDS: FieldDef[] = [
  { key: 'category', label: '1. 대분류 (Category)', required: true },
  { key: 'name', label: '2. 품목명', required: true },
  { key: 'standard', label: '3. 규격', required: false },
  { key: 'model', label: '4. 품번 (비고)', required: false },
  { key: 'manufacturer', label: '5. 제조사', required: false },
  { key: 'currentStock', label: '6. 현재고 (수량)', required: true },
  { key: 'unit', label: '7. 단위', required: true },
  { key: 'safeStock', label: '적정재고', required: false }, 
  { key: 'location', label: '보관장소', required: false },
  { key: 'note', label: '기타사항', required: false },
];