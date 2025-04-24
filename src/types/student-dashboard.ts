
export interface EnrolledCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  nextLesson: string;
  imageUrl: string;
}

export interface UpcomingLesson {
  id: number;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
}

export interface RecommendedCourse {
  id: number;
  title: string;
  instructor: string;
  level: string;
  rating: number;
  students: number;
  imageUrl: string;
}
