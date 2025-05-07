
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import AvailabilityListItem from './AvailabilityListItem';
import { UserAvailability } from '@/services/userAvailabilityService';

interface DayAvailabilityListProps {
  day: DayAvailability;
  onAddSlot: () => void;
  onEditSlot: (slot: UserAvailability) => void;
  onDeleteSlot: (id: string) => Promise<boolean>;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const DayAvailabilityList: React.FC<DayAvailabilityListProps> = ({
  day,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <div className="mb-4 border rounded-md">
      <div 
        className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex-1">
          <h3 className="font-medium">{day.dayName}</h3>
          <p className="text-sm text-gray-500">{day.slots.length} availability slots</p>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={(e) => {
            e.stopPropagation();
            onAddSlot();
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Slot
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-3 bg-gray-50">
          {day.slots.length > 0 ? (
            day.slots.map(slot => (
              <AvailabilityListItem
                key={slot.id}
                slot={slot}
                onEdit={onEditSlot}
                onDelete={onDeleteSlot}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No availability slots for {day.dayName}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DayAvailabilityList;
