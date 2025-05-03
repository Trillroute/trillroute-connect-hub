
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import MiniCalendar from './MiniCalendar';
import { useCalendar } from './CalendarContext';

const CalendarSidebar: React.FC = () => {
  const { currentDate, handleDateSelect, setIsCreateEventOpen } = useCalendar();
  
  return (
    <div className="hidden md:flex flex-col w-52 p-3 border-r border-gray-200 bg-white overflow-y-auto">
      <Button 
        className="flex items-center gap-2 mb-4 shadow-sm" 
        onClick={() => setIsCreateEventOpen(true)}
      >
        <Plus size={16} />
        <span>Create</span>
      </Button>
      
      <div className="mb-4">
        <MiniCalendar
          mode="single"
          selected={currentDate}
          onSelect={handleDateSelect}
          className="border-0"
        />
      </div>
      
      <div className="mt-2">
        <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
          My calendars
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="mycal" className="rounded text-blue-500" defaultChecked />
            <label htmlFor="mycal" className="ml-2 text-sm">My Schedule</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="classes" className="rounded text-green-500" defaultChecked />
            <label htmlFor="classes" className="ml-2 text-sm">Classes</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="events" className="rounded text-yellow-500" defaultChecked />
            <label htmlFor="events" className="ml-2 text-sm">Events</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
