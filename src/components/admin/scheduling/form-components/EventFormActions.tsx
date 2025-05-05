
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface EventFormActionsProps {
  onCancel?: () => void;
  submitLabel?: string;
}

const EventFormActions: React.FC<EventFormActionsProps> = ({ 
  onCancel, 
  submitLabel = 'Save Event' 
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      )}
      <Button type="submit">
        <Save className="w-4 h-4 mr-1" />
        {submitLabel}
      </Button>
    </div>
  );
};

export default EventFormActions;
