
import React from 'react';
import { Command, CommandList, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterTypeOption {
  value: string;
  label: string;
}

interface FilterTypeSelectorProps {
  filterType: string | null;
  onFilterTypeChange: (type: string) => void;
  loading: boolean;
}

const filterTypes: FilterTypeOption[] = [
  { value: 'course', label: 'Course' },
  { value: 'skill', label: 'Skill' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' }
];

export const FilterTypeSelector: React.FC<FilterTypeSelectorProps> = ({
  filterType,
  onFilterTypeChange,
  loading
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between"
          disabled={loading}
        >
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {filterType ? 
              filterTypes.find(t => t.value === filterType)?.label : 
              'Select filter type'}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search filter types..." />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup>
              {filterTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  onSelect={() => onFilterTypeChange(type.value)}
                  className="flex items-center"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filterType === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{type.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
