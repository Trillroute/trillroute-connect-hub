
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { Loader2 } from 'lucide-react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import DayAccordionItem from './DayAccordionItem';

interface ScheduleContentProps {
  dailyAvailability: DayAvailability[];
  isContentLoading: boolean;
  hasData: boolean;
  onAddSlot: (dayOfWeek: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  dailyAvailability,
  isContentLoading,
  hasData,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  if (isContentLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        No availability data could be loaded
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {dailyAvailability.map((day) => (
          <DayAccordionItem
            key={day.dayOfWeek}
            day={day}
            onAddSlot={onAddSlot}
            onUpdateSlot={onUpdateSlot}
            onDeleteSlot={onDeleteSlot}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ScheduleContent;
