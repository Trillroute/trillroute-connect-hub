
import React, { useState, useEffect } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvailability } from '@/services/userAvailabilityService';
import { Plus, Clock, Trash } from 'lucide-react';
import { format, parse } from 'date-fns';
import TimeSlotDialog from './TimeSlotDialog';

interface DayAvailabilityPanelProps {
  day: DayAvailability;
  onAddSlot: (startTime: string, endTime: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const DayAvailabilityPanel: React.FC<DayAvailabilityPanelProps> = ({
  day,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<UserAvailability | null>(null);
  
  // Debug log when component renders or day changes
  useEffect(() => {
    console.log(`DayAvailabilityPanel for ${day.dayName}:`, {
      dayOfWeek: day.dayOfWeek,
      slots: day.slots,
      slotsCount: day.slots.length
    });
  }, [day]);
  
  const handleOpenEditDialog = (slot: UserAvailability) => {
    setEditingSlot(slot);
    setIsAddDialogOpen(true);
  };
  
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
  
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingSlot(null);
  };
  
  const handleSaveSlot = async (startTime: string, endTime: string) => {
    let success = false;
    
    if (editingSlot) {
      success = await onUpdateSlot(editingSlot.id, startTime, endTime);
    } else {
      success = await onAddSlot(startTime, endTime);
    }
    
    if (success) {
      handleCloseDialog();
    }
    
    return success;
  };

  return (
    <div className="py-2">
      {day.slots.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No availability slots defined for {day.dayName}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {day.slots.map(slot => (
            <Card 
              key={slot.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenEditDialog(slot)}
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
                    onDeleteSlot(slot.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <TimeSlotDialog 
        open={isAddDialogOpen}
        onOpenChange={handleCloseDialog}
        onSave={handleSaveSlot}
        initialStartTime={editingSlot?.startTime}
        initialEndTime={editingSlot?.endTime}
        isEditing={!!editingSlot}
        day={day.dayName}
      />
    </div>
  );
};

export default DayAvailabilityPanel;
