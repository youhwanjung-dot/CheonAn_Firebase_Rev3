
import { WorkSheet, utils } from 'xlsx';
import { InventoryItem, Category } from '../../types';

export const cleanNumber = (val: unknown): number => {
  if (typeof val === 'number') return Math.round(val);
  if (!val) return 0;
  const strVal = String(val).replace(/,/g, '').trim();
  const num = parseFloat(strVal);
  return isNaN(num) ? 0 : Math.round(num);
};

export const resolveMergedCells = (ws: WorkSheet) => {
  if (!ws['!merges']) return;

  ws['!merges'].forEach((merge) => {
    const startRef = utils.encode_cell(merge.s);
    const startCell = ws[startRef];

    if (startCell) {
      for (let r = merge.s.r; r <= merge.e.r; r++) {
        for (let c = merge.s.c; c <= merge.e.c; c++) {
          const targetRef = utils.encode_cell({ c, r });
          if (!ws[targetRef]) {
            ws[targetRef] = { ...startCell };
          }
        }
      }
    }
  });
  delete ws['!merges'];
};

export const processCheonanLegacyFormat = (
  data: unknown[][],
  headerRowIndex: number
): InventoryItem[] | null => {
  try {
    const headerRow = data[headerRowIndex] as string[];
    const normalize = (s: unknown) => String(s || '').replace(/\s/g, '');

    const findIndex = (keywords: string[]) =>
      headerRow.findIndex((cell) =>
        keywords.some((k) => normalize(cell).includes(k))
      );

    const colIdx = {
      nameSpec: findIndex(['품목(규격)', '품목']),
      model: findIndex(['비고(품번)', '품번']),
      manufacturer: findIndex(['제조사']),
      stock: findIndex(['재고', '현재고']),
    };

    if (colIdx.nameSpec === -1 || colIdx.stock === -1) return null;

    const items: InventoryItem[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i] as unknown[];
      if (!row || row.length === 0) continue;

      const rawNameSpec = row[colIdx.nameSpec];
      const nameSpec = rawNameSpec ? String(rawNameSpec).trim() : '';

      if (['품목', '합계', '소계'].some((k) => nameSpec.includes(k))) continue;
      if (!nameSpec) continue;

      let name = nameSpec;
      let standard = '';

      const pStart = nameSpec.indexOf('(');
      const pEnd = nameSpec.lastIndexOf(')');

      if (pStart > -1 && pEnd === nameSpec.length - 1) {
        name = nameSpec.substring(0, pStart).trim();
        standard = nameSpec.substring(pStart + 1, pEnd).trim();
      }

      const model = colIdx.model > -1 ? String(row[colIdx.model] || '') : '';
      const manufacturer =
        colIdx.manufacturer > -1 ? String(row[colIdx.manufacturer] || '') : '';
      const currentStock = cleanNumber(row[colIdx.stock]);

      items.push({
        id: `CHN-${Date.now()}-${i}`,
        lastUpdated: today,
        category: Category.ELECTRIC, // Default category
        name: name,
        standard: standard,
        model: model,
        manufacturer: manufacturer,
        unit: 'EA',
        currentStock: currentStock,
        safeStock: 1,
        location: '',
        note: '',
      });
    }

    return items;
  } catch (e) {
    console.error('Cheonan parsing error', e);
    return null;
  }
};

export const guessMapping = (headers: string[]) => {
    const newMapping: { [key: string]: string } = {};
    
    const targets: Record<string, string[]> = {
      category: ['대분류'],
      name: ['품목명', '품명', '품목(규격)', '품목'],
      standard: ['규격', '사양'],
      model: ['품번', '모델', '비고(품번)'],
      manufacturer: ['제조사', '브랜드'],
      currentStock: ['재고', '현재고', '잔량'],
      unit: ['단위', '관리단위'],
      safeStock: ['적정재고', '안전재고'],
      location: ['보관장소', '위치'],
      note: ['비고', '기타사항']
    };

    for (const [field, keywords] of Object.entries(targets)) {
      for (const header of headers) {
        const hClean = header.replace(/\s/g, '');
        if (keywords.includes(header) || keywords.some(k => k.replace(/\s/g, '') === hClean)) {
           newMapping[field] = header;
           break; 
        }
      }
    }
    return newMapping;
  };
