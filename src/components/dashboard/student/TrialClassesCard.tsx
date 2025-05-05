
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { useTrialSlots } from '@/hooks/useTrialSlots';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const TrialClassesCard: React.FC = () => {
  const { myTrialSlots, loading, cancelTrialSlot } = useTrialSlots();
  const { toast } = useToast();

  const handleCancelTrial = async (slotId: string, courseTitle?: string) => {
    const success = await cancelTrialSlot(slotId);
    
    if (success) {
      toast({
        title: "Trial Class Cancelled",
        description: `Your trial class for ${courseTitle || 'the course'} has been cancelled.`
      });
    } else {
      toast({
        title: "Failed to Cancel",
        description: "There was a problem cancelling your trial class",
        variant: "destructive"
      });
    }
  };

  // Filter to get only upcoming trials
  const upcomingTrials = myTrialSlots.filter(slot => 
    new Date(slot.startTime) > new Date()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Trial Classes</CardTitle>
        <CardDescription>
          Your scheduled trial classes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loading-spinner" />
          </div>
        ) : upcomingTrials.length > 0 ? (
          <div className="space-y-4">
            {upcomingTrials.map((trial) => (
              <div key={trial.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{trial.courseTitle || 'Trial Class'}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(trial.startTime, 'EEEE, MMMM d')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {format(trial.startTime, 'h:mm a')} - {format(trial.endTime, 'h:mm a')}
                      </span>
                    </div>
                    {trial.teacherName && (
                      <p className="text-sm mt-2">
                        Teacher: {trial.teacherName}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelTrial(trial.id, trial.courseTitle)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any upcoming trial classes</p>
            <Button className="mt-4 bg-music-500 hover:bg-music-600" onClick={() => window.location.href = '/courses'}>
              Browse Courses
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
