
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
import { Badge } from '@/components/ui/badge';
import { AVAILABILITY_CATEGORIES } from '@/services/availability/types';

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

  // Function to get badge color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Session':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Break':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Office':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Meeting':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Class Setup':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'QC':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
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
              <div className="space-y-2">
                {day.slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:bg-gray-50">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>
                        <Badge variant="outline" className={getCategoryColor(slot.category)}>
                          {slot.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditSlot(slot)}>Edit</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-50 hover:border-red-200" 
                        onClick={() => onDeleteSlot(slot.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
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
