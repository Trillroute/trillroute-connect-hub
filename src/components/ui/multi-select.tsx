
import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(item => item !== value));
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
              "w-full justify-between border border-input bg-background px-3 py-2 h-auto min-h-[40px] text-left",
              className,
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                selected.map(value => (
                  <Badge key={value} variant="secondary" className="mr-1 mb-1">
                    {options.find(opt => opt.value === value)?.label || value}
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
                      <span className="sr-only">Remove {value}</span>
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}
                  >
                    {selected.includes(option.value) && <Check className="h-3 w-3" />}
                  </div>
                  {option.label}
                </CommandItem>
              ))}
              {options.length === 0 && (
                <div className="py-2 px-2 text-center text-sm text-muted-foreground">No options available</div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
