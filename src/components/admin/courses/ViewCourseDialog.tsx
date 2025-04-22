
import React from 'react';
import { format } from 'date-fns';
import { Course } from '@/types/course';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface ViewCourseDialogProps {
  course: Course | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCourseDialog = ({ course, isOpen, onOpenChange }: ViewCourseDialogProps) => {
  if (!course) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
          <DialogDescription>
            Detailed information for {course.title}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="py-4 pr-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="pt-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block">Title:</span>
                    <span>{course.title}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Description:</span>
                    <span className="text-sm text-muted-foreground">{course.description}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Skill:</span>
                    <span>{course.skill}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Level:</span>
                    <span>{course.level}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Duration:</span>
                    <span>{course.duration} {course.duration_type}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Created:</span>
                    <span>{format(new Date(course.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="pt-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block">Students Enrolled:</span>
                    <span>{course.students}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Number of Instructors:</span>
                    <span>{course.instructor_ids.length}</span>
                  </div>
                  {course.image && (
                    <div>
                      <span className="font-semibold block">Course Image:</span>
                      <div className="mt-2">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full max-w-xs rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="pt-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block">Classes:</span>
                    <div className="text-sm text-muted-foreground">
                      Class schedule is not available for this course.
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block">Studio Sessions:</span>
                    <div className="text-sm text-muted-foreground">
                      Studio session data is not available.
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block">Practical Sessions:</span>
                    <div className="text-sm text-muted-foreground">
                      Practical session data is not available.
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseDialog;
