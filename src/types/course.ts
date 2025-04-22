
export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  students: number;
  image: string;
  skill: string;
  duration: string;
  duration_type: string;
  created_at: string;
  instructor_ids: string[];
  student_ids?: string[];
  // Add the new field:
  class_types_data?: ClassTypeData[];
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

// For the class_types_data field.
export interface ClassTypeData {
  class_type_id: string;
  quantity: number;
}

export interface CourseInstructor {
  id: string;
  course_id: string;
  instructor_id: string;
  created_at: string;
}

export type DurationMetric = 'days' | 'weeks' | 'months' | 'years';
