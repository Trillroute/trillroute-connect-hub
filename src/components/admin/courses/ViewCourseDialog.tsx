
import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import EditCourseDialog from './EditCourseDialog';
import DeleteCourseDialog from './DeleteCourseDialog';

interface ViewCourseDialogProps {
  course: Course | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ClassType {
  id: string;
  name: string;
  description: string;
  duration_metric: string;
  duration_value: number | null;
  max_students: number;
  price_inr: number;
}

const ViewCourseDialog = ({ course, isOpen, onOpenChange, onSuccess }: ViewCourseDialogProps) => {
  const [classTypes, setClassTypes] = useState<Record<string, ClassType>>({});
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen && course?.class_types_data?.length) {
      fetchClassTypes();
    }
  }, [isOpen, course]);

  const fetchClassTypes = async () => {
    if (!course?.class_types_data?.length) return;
    
    setLoading(true);
    try {
      const ids = course.class_types_data.map(ct => ct.class_type_id);
      
      const { data, error } = await supabase
        .from("class_types")
        .select("*")
        .in("id", ids);
        
      if (error) {
        console.error("Error fetching class types:", error);
        return;
      }
      
      const typesDict: Record<string, ClassType> = {};
      data.forEach(type => {
        typesDict[type.id] = type;
      });
      
      setClassTypes(typesDict);
    } catch (error) {
      console.error("Unexpected error fetching class types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onOpenChange(false);
  };

  if (!course) return null;

  return (
    <>
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
                      <span className="font-semibold block">Class Types:</span>
                      {loading ? (
                        <div className="text-sm text-muted-foreground">Loading class details...</div>
                      ) : course.class_types_data && course.class_types_data.length > 0 ? (
                        <div className="mt-2 border rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium">Class Type</th>
                                <th className="px-4 py-2 text-left font-medium">Quantity</th>
                                <th className="px-4 py-2 text-left font-medium">Duration</th>
                                <th className="px-4 py-2 text-left font-medium">Max Students</th>
                              </tr>
                            </thead>
                            <tbody>
                              {course.class_types_data.map((classTypeData) => {
                                const classType = classTypes[classTypeData.class_type_id];
                                return (
                                  <tr key={classTypeData.class_type_id} className="border-t">
                                    <td className="px-4 py-2">{classType?.name || 'Unknown Class'}</td>
                                    <td className="px-4 py-2">{classTypeData.quantity}</td>
                                    <td className="px-4 py-2">
                                      {classType ? `${classType.duration_value} ${classType.duration_metric}` : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2">{classType?.max_students || 'N/A'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No class types have been added to this course.
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <span className="font-semibold block">Total Sessions:</span>
                      <div className="text-sm">
                        {course.class_types_data && course.class_types_data.length > 0
                          ? course.class_types_data.reduce((sum, ct) => sum + ct.quantity, 0) + " sessions"
                          : "No sessions scheduled"}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={handleEditClick}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDeleteClick}>
                  Delete
                </Button>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {course && (
        <>
          {editDialogOpen && (
            <EditCourseDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              course={course}
              onSuccess={handleEditSuccess}
            />
          )}
          
          {deleteDialogOpen && (
            <DeleteCourseDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              course={course}
              onSuccess={handleEditSuccess}
            />
          )}
        </>
      )}
    </>
  );
};

export default ViewCourseDialog;
