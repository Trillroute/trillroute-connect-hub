
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnrolledCourse } from '@/types/student-dashboard';

interface EnrolledCourseCardProps {
  course: EnrolledCourse;
}

export const EnrolledCourseCard = ({ course }: EnrolledCourseCardProps) => {
  return (
    <Card className="overflow-hidden music-card-hover">
      <div className="h-48 overflow-hidden">
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>Instructor: {course.instructor}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-1">Next Lesson:</div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-1 text-music-500" />
            <span>{course.nextLesson}</span>
          </div>
        </div>
        
        <Link to={`/courses/${course.id}`} className="w-full">
          <Button variant="outline" className="w-full border-music-300 text-music-500 hover:bg-music-50">
            <PlayCircle className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
