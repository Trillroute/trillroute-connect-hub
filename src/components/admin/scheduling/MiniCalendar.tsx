
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MiniCalendarProps {
  className?: string;
  mode: "single";
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  initialFocus?: boolean;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ 
  className, 
  mode, 
  selected, 
  onSelect, 
  initialFocus 
}) => {
  return (
    <Calendar
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      initialFocus={initialFocus}
      className={cn("p-3 pointer-events-auto", className)}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
    />
  );
};

export default MiniCalendar;
