
import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

// Props
interface EditCourseStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  afterSave?: () => void;
  fetchOnOpen?: boolean;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const EditCourseStudentsDialog: React.FC<EditCourseStudentsDialogProps> = ({
  open,
  onOpenChange,
  course,
  afterSave,
  fetchOnOpen = false,
}) => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected/enrolled student IDs for the course
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const isFetching = useRef(false);

  // Fetch all students from the API directly
  const fetchStudents = async () => {
    setLoading(true);
    isFetching.current = true;
    const { data, error } = await supabase
      .from("custom_users")
      .select("id, first_name, last_name, email")
      .eq("role", "student");
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load students.",
        variant: "destructive",
      });
      setStudents([]);
      setLoading(false);
      isFetching.current = false;
      return;
    }
    setStudents(data || []);
    setLoading(false);
    isFetching.current = false;
  };

  // Always refetch both student list and course student_ids when opened
  useEffect(() => {
    if (open && fetchOnOpen) {
      fetchStudents();
      setSelectedStudentIds(Array.isArray(course.student_ids) ? [...course.student_ids] : []);
    }
  }, [open, course, fetchOnOpen]);

  // Use an async "search box" for students
  const handleAddStudent = (studentId: string) => {
    setSelectedStudentIds((prev) => prev.includes(studentId) ? prev : [...prev, studentId]);
  };

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
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

  // Filtering for "search"
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStudents = students.filter(
    (student) =>
      (student.first_name + " " + student.last_name + " " + student.email)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Students for "{course.title}"</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          {/* Search box for students */}
          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          {loading ? (
            <div>Loading students...</div>
          ) : (
            <>
              <div className="mb-2">
                <span className="font-medium text-sm">Currently enrolled students:</span>
                {selectedStudentIds.length === 0 ? (
                  <div className="text-xs text-muted-foreground mt-1">No students enrolled.</div>
                ) : (
                  <ul className="ml-2 mt-1 flex flex-wrap gap-2">
                    {selectedStudentIds
                      .map((id) => students.find((s) => s.id === id))
                      .filter(Boolean)
                      .map((student) => (
                        <li key={student!.id} className="flex items-center bg-secondary text-xs px-2 py-1 rounded">
                          {student!.first_name} {student!.last_name} ({student!.email})
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-1 p-0 text-destructive hover:bg-transparent"
                            onClick={() => handleRemoveStudent(student!.id)}
                            title="Remove student"
                          >
                            ×
                          </Button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Add new students by search */}
              <div>
                <span className="font-medium text-sm">Add students:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {filteredStudents
                    .filter((s) => !selectedStudentIds.includes(s.id))
                    .slice(0, 6) // Only show a max of 6 results to avoid performance issues
                    .map((student) => (
                      <Button
                        key={student.id}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddStudent(student.id)}
                        className="py-0 px-2"
                      >
                        {student.first_name} {student.last_name}
                        <span className="ml-1 text-muted-foreground text-xs">({student.email})</span>
                        <Users className="w-3 h-3 ml-1" />
                      </Button>
                    ))}
                  {filteredStudents.filter((s) => !selectedStudentIds.includes(s.id)).length === 0 && searchTerm.length > 0 && (
                    <span className="text-xs text-muted-foreground py-1">No results...</span>
                  )}
                </div>
              </div>
            </>
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

// Switched to fetch students explicitly when dialog opens,
// used custom search + tag removal UI instead of checkboxes.
