
import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  // Always ensure options is an array
  const safeOptions: Option[] = Array.isArray(options) ? options : [];
  
  // Always ensure selected is an array of strings
  const safeSelected: string[] = Array.isArray(selected) ? selected : [];
  
  // Debug logging
  useEffect(() => {
    console.log('MultiSelect props:', { 
      optionsCount: safeOptions.length, 
      selectedCount: safeSelected.length,
      open
    });
  }, [safeOptions, safeSelected, open]);

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

  const handleRemove = (value: string) => {
    onChange(safeSelected.filter(item => item !== value));
  };

  return (
    <div className="relative" ref={inputRef}>
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
                safeSelected.map(value => {
                  const selectedOption = safeOptions.find(opt => opt.value === value);
                  return (
                    <Badge key={value} variant="secondary" className="mr-1 mb-1">
                      {selectedOption?.label || value}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRemove(value);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(value);
                        }}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {selectedOption?.label || value}</span>
                      </button>
                    </Badge>
                  );
                })
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
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    safeSelected.includes(option.value) ? "bg-accent/50" : ""
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      safeSelected.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}
                  >
                    {safeSelected.includes(option.value) && <Check className="h-3 w-3" />}
                  </div>
                  <span>{option.label}</span>
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
