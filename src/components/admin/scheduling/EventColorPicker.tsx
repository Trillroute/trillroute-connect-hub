
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorOptions = [
  { name: 'Blue', value: '#4285F4' },
  { name: 'Green', value: '#0F9D58' },
  { name: 'Yellow', value: '#F4B400' },
  { name: 'Red', value: '#DB4437' },
  { name: 'Purple', value: '#9C27B0' },
];

interface EventColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const EventColorPicker: React.FC<EventColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          className={cn(
            'h-8 w-8 rounded-full border-2',
            selectedColor === color.value ? 'border-black' : 'border-transparent'
          )}
          style={{ backgroundColor: color.value }}
          onClick={() => onColorSelect(color.value)}
          title={color.name}
          aria-label={`Select ${color.name} color`}
        >
          {selectedColor === color.value && (
            <Check className="h-4 w-4 text-white mx-auto" />
          )}
        </button>
      ))}
    </div>
  );
};

export default EventColorPicker;
