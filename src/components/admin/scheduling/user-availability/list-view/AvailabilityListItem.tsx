
import React from 'react';
import { UserAvailability } from '@/services/userAvailabilityService';
import { 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AvailabilityListItemProps {
  slot: UserAvailability;
  onEdit: (slot: UserAvailability) => void;
  onDelete: (id: string) => Promise<boolean>;
}

const AvailabilityListItem: React.FC<AvailabilityListItemProps> = ({
  slot,
  onEdit,
  onDelete
}) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      await onDelete(slot.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(slot);
  };

  return (
    <div className="flex items-center justify-between p-3 mb-2 bg-white border rounded-md hover:bg-gray-50">
      <div>
        <span className="text-gray-700 font-medium">
          {slot.startTime} - {slot.endTime}
        </span>
      </div>
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit slot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete slot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AvailabilityListItem;
