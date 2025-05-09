
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type CheckboxOption = {
  label: string;
  value: string;
};

interface CheckboxMultiSelectProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function CheckboxMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  label
}: CheckboxMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  // Always ensure options is an array
  const safeOptions: CheckboxOption[] = Array.isArray(options) ? options : [];
  
  // Always ensure selected is an array of strings
  const safeSelected: string[] = Array.isArray(selected) ? selected : [];
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    if (safeSelected.includes(value)) {
      onChange(safeSelected.filter(item => item !== value));
    } else {
      onChange([...safeSelected, value]);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between border border-input bg-white px-3 py-2 h-auto min-h-[40px] text-left",
              className,
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1">
              {safeSelected.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">
                    {safeSelected.length} selected
                  </Badge>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white" align="start">
          <div className="max-h-[300px] overflow-auto p-1">
            {safeOptions.length > 0 ? (
              safeOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm"
                >
                  <Checkbox 
                    id={`option-${option.value}`} 
                    checked={safeSelected.includes(option.value)} 
                    onCheckedChange={() => handleSelect(option.value)}
                  />
                  <label 
                    htmlFor={`option-${option.value}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </label>
                </div>
              ))
            ) : (
              <div className="py-2 px-2 text-center text-sm text-muted-foreground">No options available</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
