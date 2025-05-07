
import React, { memo, useCallback } from 'react';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { UserAvailability } from '@/services/userAvailabilityService';

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
  // Format time string for display - memoize this calculation
  const formatTimeString = useCallback((timeString: string) => {
    try {
      // Parse the time string and format it to 12-hour format
      const date = parse(timeString, 'HH:mm:ss', new Date());
      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  }, []);

  const startTimeFormatted = formatTimeString(slot.startTime);
  const endTimeFormatted = formatTimeString(slot.endTime);

  const handleEditClick = useCallback(() => {
    onEdit(slot);
  }, [onEdit, slot]);

  const handleDeleteClick = useCallback(async () => {
    if (window.confirm(`Are you sure you want to delete this availability slot?`)) {
      try {
        await onDelete(slot.id);
      } catch (error) {
        console.error("Error deleting slot:", error);
      }
    }
  }, [onDelete, slot.id]);

  return (
    <div className="flex items-center justify-between p-2 border rounded bg-white">
      <div className="flex-1">
        <span className="font-medium">
          {startTimeFormatted} - {endTimeFormatted}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEditClick}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDeleteClick}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(AvailabilityListItem);
