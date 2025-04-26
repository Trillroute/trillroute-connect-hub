
export interface EnrolledCourse {
  id: string;
  title: string;
  description?: string;
  image?: string;
  imageUrl?: string;  // Add this property
  progress: number;
  instructors: string[];
  instructor?: string; // Add this property for backward compatibility
  nextLessonDate?: string;
  nextLesson?: string; // Add this property for backward compatibility
}

export interface UpcomingLesson {
  id: string;
  courseId: string;
  courseName: string;
  title?: string;  // Add this property
  date: string;
  time: string;
  instructor: string;
  location?: string;
  isOnline: boolean;
  duration?: string; // Add this property
}

export interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string; // Add this property
  level: string;
  instructors?: string[];
  instructor?: string; // Add this property for backward compatibility
  rating?: number; // Add this property
}
