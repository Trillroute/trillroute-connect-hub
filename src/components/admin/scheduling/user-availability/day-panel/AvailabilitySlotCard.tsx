
import React from 'react';
import { UserAvailability } from '@/services/userAvailabilityService';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, Clock, Tag } from 'lucide-react';

interface AvailabilitySlotCardProps {
  slot: UserAvailability;
  onEdit: (slot: UserAvailability) => void;
  onDelete: (id: string) => Promise<boolean>;
}

// Function to get icon based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Session':
      return <Calendar className="w-4 h-4" />;
    case 'Break':
      return <Clock className="w-4 h-4" />;
    case 'Office':
    case 'Meeting':
    case 'Class Setup':
    case 'QC':
      return <Tag className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

// Function to get badge color based on category
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Session':
      return 'bg-green-100 text-green-800';
    case 'Break':
      return 'bg-blue-100 text-blue-800';
    case 'Office':
      return 'bg-purple-100 text-purple-800';
    case 'Meeting':
      return 'bg-yellow-100 text-yellow-800';
    case 'Class Setup':
      return 'bg-orange-100 text-orange-800';
    case 'QC':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AvailabilitySlotCard: React.FC<AvailabilitySlotCardProps> = ({
  slot,
  onEdit,
  onDelete
}) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      await onDelete(slot.id);
    }
  };

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-medium">
            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
          </div>
          <div className={`inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs ${getCategoryColor(slot.category)}`}>
            {getCategoryIcon(slot.category)}
            <span className="ml-1">{slot.category}</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(slot)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AvailabilitySlotCard);
