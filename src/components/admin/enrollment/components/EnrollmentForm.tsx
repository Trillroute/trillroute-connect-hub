
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseDetailsCard } from './CourseDetailsCard';
import { TimeSlotCard } from './TimeSlotCard';
import { GroupCourseNotice } from './GroupCourseNotice';
import { Course, Teacher } from '@/types/course';
import { UserAvailability } from '@/services/availability/types';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

interface EnrollmentFormProps {
  // Data
  students: Student[];
  courses: Course[];
  teachers: Teacher[];
  
  // Loading states
  studentsLoading: boolean;
  coursesLoading: boolean;
  teachersLoading: boolean;
  
  // Selected values
  selectedStudentId: string;
  selectedCourseId: string;
  selectedTeacherId: string;
  selectedAvailabilitySlot: UserAvailability | null;
  
  // Handlers
  setSelectedStudentId: (id: string) => void;
  setSelectedCourseId: (id: string) => void;
  setSelectedTeacherId: (id: string) => void;
  onChangeTimeSlot: () => void;
  
  // Computed properties
  selectedCourse: Course | null;
  shouldDisplayTeacherField: boolean;
  isGroupRecurring: boolean;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  students,
  courses,
  teachers,
  studentsLoading,
  coursesLoading,
  teachersLoading,
  selectedStudentId,
  selectedCourseId,
  selectedTeacherId,
  selectedAvailabilitySlot,
  setSelectedStudentId,
  setSelectedCourseId,
  setSelectedTeacherId,
  onChangeTimeSlot,
  selectedCourse,
  shouldDisplayTeacherField,
  isGroupRecurring
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student">Select Student</Label>
        <Select 
          value={selectedStudentId} 
          onValueChange={setSelectedStudentId}
          disabled={studentsLoading}
        >
          <SelectTrigger id="student">
            <SelectValue placeholder="Select a student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="course">Select Course</Label>
        <Select 
          value={selectedCourseId} 
          onValueChange={setSelectedCourseId}
          disabled={coursesLoading}
        >
          <SelectTrigger id="course">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title} ({course.course_type}, {course.duration_type}) - ₹{course.final_price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {shouldDisplayTeacherField && (
        <div className="space-y-2">
          <Label htmlFor="teacher">Select Teacher</Label>
          <Select 
            value={selectedTeacherId} 
            onValueChange={setSelectedTeacherId}
            disabled={teachersLoading}
          >
            <SelectTrigger id="teacher">
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedAvailabilitySlot && (
        <TimeSlotCard 
          slot={selectedAvailabilitySlot} 
          onChangeSlot={onChangeTimeSlot}
        />
      )}
      
      {isGroupRecurring && !selectedAvailabilitySlot && selectedCourse?.instructor_ids?.length > 0 && (
        <GroupCourseNotice />
      )}
      
      {selectedCourse && (
        <CourseDetailsCard course={selectedCourse} />
      )}
    </div>
  );
};
