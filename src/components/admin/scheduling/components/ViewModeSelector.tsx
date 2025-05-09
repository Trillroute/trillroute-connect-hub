
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ViewOption {
  value: string;
  label: string;
}

interface ViewModeSelectorProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  viewOptions: ViewOption[];
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  setViewMode,
  viewOptions
}) => {
  // Add a safety check to make sure viewOptions is an array
  const options = Array.isArray(viewOptions) ? viewOptions : [
    { value: 'day', label: 'Day View' },
    { value: 'week', label: 'Week View' },
    { value: 'month', label: 'Month View' },
    { value: 'list', label: 'List View' }
  ];
  
  const currentView = options.find(opt => opt.value === viewMode)?.label || 'Select View';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-white border rounded-md w-[150px] justify-between">
          <span>{currentView}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px] bg-white">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setViewMode(option.value)}
            className={cn(
              "cursor-pointer", 
              viewMode === option.value ? "bg-gray-100" : ""
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeSelector;
