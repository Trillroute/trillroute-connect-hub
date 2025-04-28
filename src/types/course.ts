
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
  class_types_data?: ClassTypeData[];
  // Pricing related fields
  final_price?: number | null;
  base_price?: number | null;
  discount_value?: number | null;
  discount_metric?: string | null;
  discount_code?: string | null;
  discount_validity?: string | null;
  gst_rate?: number | null;
  is_gst_applicable?: boolean | null;
  // Additional fields from database that might be causing type issues
  status?: string;
  category?: string;
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ClassTypeData {
  class_type_id: string;
  quantity: number;
  duration_value?: number;
  duration_metric?: string;
}

export interface CourseInstructor {
  id: string;
  course_id: string;
  instructor_id: string;
  created_at: string;
}

export type DurationMetric = 'days' | 'weeks' | 'months' | 'years';
