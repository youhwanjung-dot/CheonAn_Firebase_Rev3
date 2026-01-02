import React from 'react';
import ReportModal from '../ReportModal';
import ConfirmationModal from '../ConfirmationModal';
import { InventoryItem } from '../../types';

interface InventoryModalsProps {
  showReport: boolean;
  setShowReport: (show: boolean) => void;
  filteredItems: InventoryItem[];
  colWidths: Record<string, number>;
  showLayoutReset: boolean;
  setShowLayoutReset: (show: boolean) => void;
  handleResetLayoutConfirm: () => void;
}

const InventoryModals: React.FC<InventoryModalsProps> = ({ 
  showReport, 
  setShowReport, 
  filteredItems, 
  colWidths, 
  showLayoutReset, 
  setShowLayoutReset, 
  handleResetLayoutConfirm 
}) => {
  return (
    <>
      {showReport && (
        <ReportModal items={filteredItems} onClose={() => setShowReport(false)} columnWidths={colWidths} />
      )}
      {showLayoutReset && (
        <ConfirmationModal
          title="레이아웃 초기화"
          message="테이블 컬럼 너비를 기본값으로 되돌리시겠습니까?"
          onConfirm={handleResetLayoutConfirm}
          onCancel={() => setShowLayoutReset(false)}
        />
      )}
    </>
  );
};

export default InventoryModals;
