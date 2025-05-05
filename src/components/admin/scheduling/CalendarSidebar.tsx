import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MiniCalendar from './MiniCalendar';
import { useCalendar } from './context/CalendarContext';

const CalendarSidebar: React.FC = () => {
  const { currentDate, handleDateSelect, setIsCreateEventOpen, refreshEvents, isLoading } = useCalendar();
  
  return (
    <div className="hidden md:flex flex-col w-52 p-4 border-r border-gray-200 bg-white overflow-y-auto">
      <Button 
        className="flex items-center gap-2 mb-6 shadow-sm w-full" 
        onClick={() => setIsCreateEventOpen(true)}
      >
        <Plus size={16} />
        <span>Create Event</span>
      </Button>
      
      <div className="mb-6">
        <MiniCalendar
          mode="single"
          selected={currentDate}
          onSelect={handleDateSelect}
          className="border-0"
        />
      </div>
    </div>
  );
};

export default CalendarSidebar;
