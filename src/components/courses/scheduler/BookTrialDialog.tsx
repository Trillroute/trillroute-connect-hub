
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useBookTrialDialog } from './hooks/useBookTrialDialog';
import { DateSelector } from './components/DateSelector';
import { TimeSlotsSelector } from './components/TimeSlotsSelector';
import { SelectedSlotSummary } from './components/SelectedSlotSummary';

interface BookTrialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  onSuccess?: () => void;
}

const BookTrialDialog: React.FC<BookTrialDialogProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  onSuccess
}) => {
  const {
    date,
    setDate,
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    loading,
    bookingInProgress,
    handleBookTrial
  } = useBookTrialDialog({ courseId, onClose, onSuccess });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book a Trial Class</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateSelector date={date} onDateChange={setDate} />
            
            <TimeSlotsSelector 
              loading={loading}
              availableSlots={availableSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              date={date}
            />
          </div>
          
          <SelectedSlotSummary selectedSlot={selectedSlot} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBookTrial} 
            disabled={!selectedSlot || bookingInProgress}
          >
            {bookingInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Book Trial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookTrialDialog;
