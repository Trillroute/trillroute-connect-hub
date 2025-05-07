
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon,
  LayoutGrid,
  List, 
  CalendarDays, 
  CalendarRange
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

interface ViewModeSelectorProps {
  showEventList?: boolean;
  setShowEventList?: (show: boolean) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  showEventList,
  setShowEventList
}) => {
  const { viewMode, setViewMode } = useCalendar();

  const handleViewChange = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  // Toggle event list view if provided
  const toggleEventList = () => {
    if (setShowEventList && showEventList !== undefined) {
      setShowEventList(!showEventList);
    }
  };

  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            {viewMode === 'day' && <CalendarIcon className="h-4 w-4" />}
            {viewMode === 'week' && <CalendarRange className="h-4 w-4" />}
            {viewMode === 'month' && <CalendarDays className="h-4 w-4" />}
            <span>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleViewChange('day')}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Day View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleViewChange('week')}>
            <CalendarRange className="h-4 w-4 mr-2" />
            Week View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleViewChange('month')}>
            <CalendarDays className="h-4 w-4 mr-2" />
            Month View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {setShowEventList && showEventList !== undefined && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleEventList}
          className="flex items-center gap-1"
        >
          {showEventList ? (
            <>
              <LayoutGrid className="h-4 w-4" />
              <span>Grid View</span>
            </>
          ) : (
            <>
              <List className="h-4 w-4" />
              <span>List View</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ViewModeSelector;
