
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
  status: string; // Keeping for backwards compatibility
  created_at: string;
  instructors?: Teacher[]; // Now courses can have multiple instructors
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CourseInstructor {
  id: string;
  course_id: string;
  instructor_id: string;
  created_at: string;
}
