import { InventoryItem } from '../types';

const sortInventory = (items: InventoryItem[]): InventoryItem[] => {
  return items.sort((a, b) => {
    const catCompare = a.category.localeCompare(b.category);
    if (catCompare !== 0) return catCompare;
    const nameCompare = a.name.localeCompare(b.name);
    if (nameCompare !== 0) return nameCompare;
    const stdCompare = (a.standard || '').localeCompare(b.standard || '');
    if (stdCompare !== 0) return stdCompare;
    const modelCompare = (a.model || '').localeCompare(b.model || '');
    if (modelCompare !== 0) return modelCompare;
    const manufacturerCompare = (a.manufacturer || '').localeCompare(b.manufacturer || '');
    return manufacturerCompare;
  });
};

export default sortInventory;
