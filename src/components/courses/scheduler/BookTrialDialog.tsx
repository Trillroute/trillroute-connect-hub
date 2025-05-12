
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Loader2, CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { bookTrialClass, fetchAvailableSlotsForCourse, AvailabilitySlot } from '@/services/availability/teaching';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

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
  const { toast } = useToast();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch available slots when the dialog opens or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!isOpen || !courseId) return;
      
      setLoading(true);
      try {
        const slots = await fetchAvailableSlotsForCourse(courseId);
        
        // Filter slots for the selected date if a date is selected
        const filteredSlots = date 
          ? slots.filter(slot => {
              const slotDate = new Date(slot.startTime);
              return slotDate.toDateString() === date.toDateString();
            })
          : slots;
        
        setAvailableSlots(filteredSlots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [isOpen, courseId, date, toast]);

  const handleBookTrial = async () => {
    if (!selectedSlot || !user?.id) {
      toast({
        title: "Error",
        description: "Please select a time slot first",
        variant: "destructive",
      });
      return;
    }

    setBookingInProgress(true);
    try {
      const success = await bookTrialClass(selectedSlot.id, user.id, courseId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Your trial class has been booked!",
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to book the trial class. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking trial:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(false);
    }
  };

  const formatTimeSlot = (slot: AvailabilitySlot) => {
    const startTime = format(new Date(slot.startTime), 'h:mm a');
    const endTime = format(new Date(slot.endTime), 'h:mm a');
    return `${startTime} - ${endTime}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book a Trial Class</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Time Slots
              </label>
              <Card>
                <CardContent className="p-2">
                  {loading ? (
                    <div className="flex justify-center items-center h-[200px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            className="w-full justify-between"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>{formatTimeSlot(slot)}</span>
                            </div>
                            {slot.teacherName && (
                              <Badge variant="outline">{slot.teacherName}</Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex justify-center items-center h-[200px] text-center text-muted-foreground">
                      {date ? "No available slots for this date" : "Please select a date"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {selectedSlot && (
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium">Selected Time:</p>
              <p>{format(new Date(selectedSlot.startTime), 'PPP')} at {formatTimeSlot(selectedSlot)}</p>
              {selectedSlot.teacherName && (
                <p>Teacher: {selectedSlot.teacherName}</p>
              )}
            </div>
          )}
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
