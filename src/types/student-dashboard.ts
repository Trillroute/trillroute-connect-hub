
export interface EnrolledCourse {
  id: string;
  title: string;
  description?: string;
  image?: string;
  progress: number;
  instructors: string[];
  nextLessonDate?: string;
}

export interface UpcomingLesson {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  instructor: string;
  location?: string;
  isOnline: boolean;
}

export interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  image?: string;
  level: string;
  instructors?: string[];
}
