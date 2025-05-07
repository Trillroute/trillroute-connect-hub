
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash } from 'lucide-react';
import { UserAvailability } from '@/services/userAvailabilityService';
import { format, parse } from 'date-fns';

interface AvailabilitySlotCardProps {
  slot: UserAvailability;
  onEdit: (slot: UserAvailability) => void;
  onDelete: (id: string) => Promise<boolean>;
}

const AvailabilitySlotCard: React.FC<AvailabilitySlotCardProps> = ({
  slot,
  onEdit,
  onDelete
}) => {
  const formatTimeForDisplay = (timeStr: string) => {
    try {
      // Parse the time string to a Date object
      const parsedTime = parse(timeStr, 'HH:mm:ss', new Date());
      // Format to 12-hour format
      return format(parsedTime, 'h:mm a');
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeStr;
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onEdit(slot)}
    >
      <CardContent className="p-3 flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">
            {formatTimeForDisplay(slot.startTime)} - {formatTimeForDisplay(slot.endTime)}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(slot.id);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvailabilitySlotCard;
