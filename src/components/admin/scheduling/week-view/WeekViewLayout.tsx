
import React, { ReactNode } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import WeekDayHeader from './WeekDayHeader';

interface WeekViewLayoutProps {
  weekDays: Date[];
  children: ReactNode;
}

const WeekViewLayout: React.FC<WeekViewLayoutProps> = ({ 
  weekDays,
  children
}) => {
  return (
    <div className="relative h-full flex flex-col">
      {/* Day headers */}
      <div className="flex border-b">
        {/* Corner cell */}
        <div className="w-16 border-r border-gray-200 bg-white">
          <div className="text-xs text-gray-500 h-12 flex items-center justify-center">
            Hours
          </div>
        </div>
        
        {/* Day headers */}
        {weekDays.map((day, i) => (
          <WeekDayHeader key={i} day={day} />
        ))}
      </div>
      
      {/* Scrollable content container */}
      <ScrollArea className="h-[calc(100%-48px)] flex-grow">
        <div className="relative min-h-[720px]">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WeekViewLayout;
