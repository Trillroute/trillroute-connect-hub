
import React from 'react';
import { Command, CommandList, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  id: string;
  name: string;
}

interface FilterOptionsSelectorProps {
  options: FilterOption[];
  selectedOptions: string[];
  onOptionSelect: (id: string) => void;
  filterType: string | null;
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const FilterOptionsSelector: React.FC<FilterOptionsSelectorProps> = ({
  options,
  selectedOptions,
  onOptionSelect,
  filterType,
  loading,
  open,
  setOpen
}) => {
  if (!filterType) return null;
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between"
          disabled={loading || options.length === 0}
        >
          <div className="truncate">
            {selectedOptions.length > 0 ? 
              `${selectedOptions.length} selected` : 
              'Select options'}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${filterType}s...`} />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup>
              {Array.isArray(options) && options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => onOptionSelect(option.id)}
                  className="flex items-center"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                      selectedOptions.includes(option.id) ? "bg-primary border-primary" : "opacity-50"
                    )}
                  >
                    {selectedOptions.includes(option.id) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span>{option.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
