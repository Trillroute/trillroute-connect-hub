
import React from 'react';
import { Button } from '@/components/ui/button';

interface BulkDeleteButtonProps {
  selectedCount: number;
  onBulkDelete: () => void;
}

const BulkDeleteButton: React.FC<BulkDeleteButtonProps> = ({
  selectedCount,
  onBulkDelete,
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="flex justify-end">
      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
      >
        Delete Selected ({selectedCount})
      </Button>
    </div>
  );
};

export default BulkDeleteButton;
