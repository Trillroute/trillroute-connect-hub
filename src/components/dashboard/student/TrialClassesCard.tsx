
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { useTrialSlots } from '@/hooks/useTrialSlots';
import { AvailabilitySlot } from '@/services/availability/teaching/types';
import { useAuth } from '@/hooks/useAuth';

interface TrialClassesCardProps {
  courseId?: string;
  userId?: string;
  title?: string;
}

const TrialClassesCard: React.FC<TrialClassesCardProps> = ({ courseId, userId, title }) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  const { availableSlots, hasTrial, loading, error, refresh } = useTrialSlots(courseId, effectiveUserId);
  
  const handleCancelTrial = async (slotId: string) => {
    // Implementation for canceling a trial would go here
    console.log("Cancel trial for slot:", slotId);
    
    // After cancellation, refresh the data
    await refresh();
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trial Classes</CardTitle>
          <CardDescription>Loading your trial classes...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle>Error Loading Trials</CardTitle>
          <CardDescription>There was a problem loading your trial classes</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => refresh()}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!hasTrial || availableSlots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trial Classes</CardTitle>
          <CardDescription>You have no upcoming trial classes</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Find a booked slot for this course
  const bookedSlot = courseId 
    ? availableSlots.find((slot: AvailabilitySlot) => slot.isBooked && slot.courseId === courseId)
    : availableSlots.find((slot: AvailabilitySlot) => slot.isBooked);

  const displayTitle = title || (bookedSlot?.courseTitle || 'Trial Class');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trial Classes</CardTitle>
        <CardDescription>Your upcoming trial classes</CardDescription>
      </CardHeader>
      <CardContent>
        {bookedSlot ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{displayTitle}</h3>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(bookedSlot.startTime), 'EEEE, MMMM d')}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {format(new Date(bookedSlot.startTime), 'h:mm a')} - 
                      {format(new Date(bookedSlot.endTime), 'h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No upcoming trial classes found for this course.</p>
        )}
      </CardContent>
      {bookedSlot && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50" 
            onClick={() => handleCancelTrial(bookedSlot.id)}
          >
            <X className="h-4 w-4 mr-1" /> Cancel Trial
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TrialClassesCard;
