
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Scheduler from './Scheduler';
import { AvailabilitySlot, bookTrialClass, hasTrialForCourse } from '@/services/teacherAvailabilityService';
import { format } from 'date-fns';

interface BookTrialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseTitle: string;
}

const BookTrialDialog: React.FC<BookTrialDialogProps> = ({
  open,
  onOpenChange,
  courseId,
  courseTitle
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingTrial, setHasExistingTrial] = useState(false);
  
  // Check if the user has already taken a trial for this course
  React.useEffect(() => {
    const checkExistingTrial = async () => {
      if (user && courseId) {
        const hasTrial = await hasTrialForCourse(user.id, courseId);
        setHasExistingTrial(hasTrial);
        
        if (hasTrial) {
          toast({
            title: "Trial Already Booked",
            description: "You've already taken a trial class for this course.",
            variant: "default",
          });
        }
      }
    };
    
    if (open) {
      checkExistingTrial();
    }
  }, [open, user, courseId, toast]);
  
  const handleBookTrial = async () => {
    if (!user || !selectedSlot) return;
    
    setIsLoading(true);
    try {
      const success = await bookTrialClass(selectedSlot.id, user.id, courseId);
      
      if (success) {
        toast({
          title: "Trial Class Booked!",
          description: `Your trial class is scheduled for ${format(selectedSlot.startTime, 'PPP')} at ${format(selectedSlot.startTime, 'h:mm a')}`,
        });
        onOpenChange(false);
        
        // Navigate to the student dashboard
        setTimeout(() => {
          navigate('/dashboard/student');
        }, 1000);
      } else {
        toast({
          title: "Booking Failed",
          description: "Unable to book your trial class. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking trial:", error);
      toast({
        title: "Booking Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to book a trial class.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate('/auth/login')}>Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Book a Trial Class</DialogTitle>
          <DialogDescription>
            {hasExistingTrial 
              ? "You've already taken a trial class for this course."
              : `Select a time slot for your trial class for ${courseTitle}`}
          </DialogDescription>
        </DialogHeader>
        
        {!hasExistingTrial && (
          <>
            <div className="py-4">
              <Scheduler 
                courseId={courseId} 
                onSlotSelect={(slot) => setSelectedSlot(slot)}
              />
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleBookTrial}
                disabled={!selectedSlot || isLoading || hasExistingTrial}
                className="bg-music-500 hover:bg-music-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Trial Class'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
        
        {hasExistingTrial && (
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-music-500 hover:bg-music-600"
            >
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookTrialDialog;
