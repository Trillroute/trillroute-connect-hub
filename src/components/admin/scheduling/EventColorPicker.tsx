
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Aligned with our category colors for consistency
const colorOptions = [
  { name: 'Green (Session)', value: '#10B981' },  // green-700
  { name: 'Blue (Break)', value: '#3B82F6' },     // blue-600
  { name: 'Purple (Office)', value: '#8B5CF6' },  // purple-600
  { name: 'Yellow (Meeting)', value: '#F59E0B' }, // yellow-500
  { name: 'Orange (Setup)', value: '#F97316' },   // orange-500
  { name: 'Pink (QC)', value: '#EC4899' },        // pink-600
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
