
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import DayAvailabilityPanel from '../DayAvailabilityPanel';

interface DayAccordionItemProps {
  day: DayAvailability;
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const DayAccordionItem: React.FC<DayAccordionItemProps> = ({
  day,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  return (
    <AccordionItem key={day.dayOfWeek} value={String(day.dayOfWeek)}>
      <div className="flex items-center">
        <AccordionTrigger className="flex-1">
          <span className="font-semibold text-lg">{day.dayName}</span>
          <span className="ml-2 text-sm text-muted-foreground">
            ({day.slots.length} {day.slots.length === 1 ? 'slot' : 'slots'})
          </span>
        </AccordionTrigger>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            const startTime = "09:00:00";
            const endTime = "10:00:00";
            onAddSlot(day.dayOfWeek, startTime, endTime);
          }}
          className="mr-4"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <AccordionContent>
        <DayAvailabilityPanel 
          day={day}
          onAddSlot={(startTime, endTime) => onAddSlot(day.dayOfWeek, startTime, endTime)}
          onUpdateSlot={onUpdateSlot}
          onDeleteSlot={onDeleteSlot}
        />
      </AccordionContent>
    </AccordionItem>
  );
};

export default DayAccordionItem;
