
// Define types for the teaching availability service

export interface AvailabilitySlot {
  id: string;
  teacherId: string;
  teacherName?: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  courseId?: string;
  studentId?: string;
}

