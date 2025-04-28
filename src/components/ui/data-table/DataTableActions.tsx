
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface DataTableActionsProps {
  row: any;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

const DataTableActions: React.FC<DataTableActionsProps> = ({
  row,
  onView,
  onEdit,
  onDelete
}) => {
  if (!onView && !onEdit && !onDelete) return null;

  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Button variant="ghost" size="sm" onClick={() => onView(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DataTableActions;
