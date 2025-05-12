
import { format } from 'date-fns';
import { AvailabilitySlot } from '@/services/availability/teaching';

interface SelectedSlotSummaryProps {
  selectedSlot: AvailabilitySlot | null;
}

export const SelectedSlotSummary: React.FC<SelectedSlotSummaryProps> = ({ selectedSlot }) => {
  if (!selectedSlot) return null;

  const formatTimeSlot = (slot: AvailabilitySlot) => {
    const startTime = format(new Date(slot.startTime), 'h:mm a');
    const endTime = format(new Date(slot.endTime), 'h:mm a');
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="bg-muted p-3 rounded-md">
      <p className="font-medium">Selected Time:</p>
      <p>{format(new Date(selectedSlot.startTime), 'PPP')} at {formatTimeSlot(selectedSlot)}</p>
      {selectedSlot.teacherName && (
        <p>Teacher: {selectedSlot.teacherName}</p>
      )}
    </div>
  );
};
