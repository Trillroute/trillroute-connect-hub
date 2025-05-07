
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {viewOptions.find(opt => opt.value === viewMode)?.label || 'Select View'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {viewOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setViewMode(option.value)}
            className={cn(viewMode === option.value ? "bg-gray-100" : "")}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeSelector;
