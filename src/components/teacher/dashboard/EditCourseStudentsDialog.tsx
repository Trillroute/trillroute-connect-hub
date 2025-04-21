
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useStudents } from "@/hooks/useStudents";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

// Props
interface EditCourseStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  afterSave?: () => void;
}

const EditCourseStudentsDialog: React.FC<EditCourseStudentsDialogProps> = ({
  open,
  onOpenChange,
  course,
  afterSave,
}) => {
  const { toast } = useToast();
  const { students, loading } = useStudents();

  // The ids currently selected/enrolled for the course.
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedStudentIds(Array.isArray(course.student_ids) ? [...course.student_ids] : []);
    }
  }, [open, course]);

  const handleToggle = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSave = async () => {
    // Store to Supabase
    const { error } = await supabase
      .from("courses")
      .update({
        student_ids: selectedStudentIds,
        students: selectedStudentIds.length,
      })
      .eq("id", course.id);

    if (error) {
      toast({
        title: "Error updating students",
        description: "Failed to save student list. Try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Course updated",
      description: `Course updated with ${selectedStudentIds.length} students.`,
      duration: 2500,
    });

    onOpenChange(false);
    if (afterSave) afterSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Students for "{course.title}"</DialogTitle>
        </DialogHeader>
        <div className="my-2 mb-4">
          {loading ? (
            <div>Loading students...</div>
          ) : students.length === 0 ? (
            <div>No students found.</div>
          ) : (
            <div className="max-h-72 overflow-auto space-y-2 pr-2">
              {students.map((student) => (
                <label
                  key={student.id}
                  className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedStudentIds.includes(student.id)}
                    onCheckedChange={() => handleToggle(student.id)}
                    id={"student-checkbox-" + student.id}
                  />
                  <span>
                    {student.first_name} {student.last_name}
                    <span className="ml-2 text-xs text-gray-500">{student.email}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseStudentsDialog;
