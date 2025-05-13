
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, ListFilter, Layers3, Grid3X3, Clock } from "lucide-react";
import { CalendarViewMode } from '../context/calendarTypes';

interface ViewModeSelectorProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        size="sm"
        variant={viewMode === 'day' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('day')}
        className="px-2.5"
        title="Day View"
      >
        <Clock className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">Day</span>
      </Button>
      
      <Button
        size="sm"
        variant={viewMode === 'week' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('week')}
        className="px-2.5"
        title="Week View"
      >
        <Calendar className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">Week</span>
      </Button>
      
      <Button
        size="sm"
        variant={viewMode === 'month' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('month')}
        className="px-2.5"
        title="Month View"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">Month</span>
      </Button>
      
      <Button
        size="sm"
        variant={viewMode === 'list' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('list')}
        className="px-2.5"
        title="List View"
      >
        <ListFilter className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">List</span>
      </Button>
      
      <Button
        size="sm"
        variant={viewMode === 'legacy' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('legacy')}
        className="px-2.5"
        title="Legacy View"
      >
        <Layers3 className="h-4 w-4" />
        <span className="ml-2 hidden md:inline">Legacy</span>
      </Button>
    </div>
  );
};

export default ViewModeSelector;
