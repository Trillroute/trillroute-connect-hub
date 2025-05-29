
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Uniform color options across all views
const colorOptions = [
  { name: 'Green (Regular Sessions)', value: '#10B981' },  // Green for regular sessions
  { name: 'Orange (Trial Classes)', value: '#F97316' },   // Orange for trial classes
  { name: 'Blue (Break)', value: '#3B82F6' },            // Blue for breaks
  { name: 'Purple (Office)', value: '#8B5CF6' },         // Purple for office
  { name: 'Yellow (Meeting)', value: '#F59E0B' },        // Yellow for meetings
  { name: 'Pink (QC)', value: '#EC4899' },               // Pink for QC
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
