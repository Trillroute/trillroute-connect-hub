
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  students: number;
  image: string;
  category: string;
  duration: string;
  status: string; // Keeping for backwards compatibility
  created_at: string;
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
