
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TeacherProfileCompletion } from '@/components/teacher/dashboard/TeacherProfileCompletion';
import { TeacherCoursesSection } from '@/components/teacher/dashboard/TeacherCoursesSection';
import { TeacherClassesSection } from '@/components/teacher/dashboard/TeacherClassesSection';
import { useToast } from '@/hooks/use-toast';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { useTrialSlots } from '@/hooks/useTrialSlots';
import { format, addMinutes, addHours, isBefore, parseISO } from 'date-fns';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { teacherCourses } = useTeacherCourses();
  const { createAvailability } = useTrialSlots();
  
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleCreateSlot = async () => {
    if (!selectedDate || !startTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your availability",
        variant: "destructive"
      });
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    // Calculate end time based on duration
    const endDateTime = addMinutes(startDateTime, duration);
    
    // Check if the start time is in the past
    if (isBefore(startDateTime, new Date())) {
      toast({
        title: "Invalid Time",
        description: "You cannot create availability slots in the past",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const success = await createAvailability(
        startDateTime, 
        endDateTime,
        selectedCourseId || undefined
      );
      
      if (success) {
        toast({
          title: "Availability Created",
          description: `You are now available on ${format(startDateTime, 'PPP')} at ${format(startDateTime, 'h:mm a')}`,
        });
        setIsSlotDialogOpen(false);
        setSelectedDate(undefined);
        setStartTime("");
        setSelectedCourseId("");
      } else {
        toast({
          title: "Failed to Create Availability",
          description: "There was a problem setting your availability",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating availability:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your classes today</p>
        </div>
        <Button 
          onClick={() => setIsSlotDialogOpen(true)}
          className="bg-music-500 hover:bg-music-600"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Availability
        </Button>
      </div>

      <TeacherProfileCompletion />
      <TeacherClassesSection />
      <TeacherCoursesSection />
      
      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Availability</DialogTitle>
            <DialogDescription>
              Select a date and time when you're available for trial classes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="date">Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border shadow"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="course">Course (Optional)</Label>
              <Select 
                value={selectedCourseId} 
                onValueChange={setSelectedCourseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Course</SelectItem>
                  {teacherCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                If selected, only students interested in this course will see this slot.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsSlotDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSlot} 
              disabled={!selectedDate || !startTime || loading}
              className="bg-music-500 hover:bg-music-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Slot'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
