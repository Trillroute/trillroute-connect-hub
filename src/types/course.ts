
export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  students: number;
  image: string;
  category: string;
  duration: string;
  duration_type: string;
  status: string;
  created_at: string;
  instructor_ids: string[];
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

// This interface is kept for backward compatibility if needed
export interface CourseInstructor {
  id: string;
  course_id: string;
  instructor_id: string;
  created_at: string;
}

// New interface for duration metrics
export type DurationMetric = 'days' | 'weeks' | 'months' | 'years';

