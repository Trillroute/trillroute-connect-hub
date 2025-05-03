
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      className={cn("w-full rounded-md border shadow-sm", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-8 w-8 p-0",
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
    />
  );
};

export default MiniCalendar;
