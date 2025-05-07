
import React, { useState } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { UserAvailability } from '@/services/userAvailabilityService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import TimeSlotDialog from '../TimeSlotDialog';
import AvailabilitySlotCard from '../day-panel/AvailabilitySlotCard';

interface DayAvailabilityListProps {
  day: DayAvailability;
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const DayAvailabilityList: React.FC<DayAvailabilityListProps> = ({ 
  day, 
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<UserAvailability | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleAddSlot = async (startTime: string, endTime: string, category: string) => {
    const success = await onAddSlot(day.dayOfWeek, startTime, endTime, category);
    if (success) {
      setIsAddDialogOpen(false);
    }
    return success;
  };
  
  const handleEditSlot = (slot: UserAvailability) => {
    setSelectedSlot(slot);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateSlot = async (startTime: string, endTime: string, category: string) => {
    if (!selectedSlot) return false;
    
    const success = await onUpdateSlot(selectedSlot.id, startTime, endTime, category);
    if (success) {
      setSelectedSlot(null);
      setIsEditDialogOpen(false);
    }
    return success;
  };

  return (
    <Accordion type="single" collapsible className="border rounded-md">
      <AccordionItem value={day.dayName}>
        <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">{day.dayName}</span>
            <span className="text-sm text-gray-500 mr-6">{day.slots.length} slots</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 space-y-4">
            {day.slots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {day.slots.map((slot) => (
                  <AvailabilitySlotCard
                    key={slot.id}
                    slot={slot}
                    onEdit={handleEditSlot}
                    onDelete={onDeleteSlot}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">
                No availability slots set for {day.dayName}
              </div>
            )}
            
            <div className="flex justify-center mt-2">
              <Button onClick={() => setIsAddDialogOpen(true)} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* Add Slot Dialog */}
      <TimeSlotDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddSlot}
        isEditing={false}
        day={day.dayName}
      />
      
      {/* Edit Slot Dialog */}
      {selectedSlot && (
        <TimeSlotDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateSlot}
          initialStartTime={selectedSlot.startTime}
          initialEndTime={selectedSlot.endTime}
          initialCategory={selectedSlot.category}
          isEditing={true}
          day={day.dayName}
        />
      )}
    </Accordion>
  );
};

export default DayAvailabilityList;
