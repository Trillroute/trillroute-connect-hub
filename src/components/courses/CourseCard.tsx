
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import BookTrialDialog from './scheduler/BookTrialDialog';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
  getInstructorNames: (course: Course) => string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, getInstructorNames }) => {
  const { user } = useAuth();
  const [isBookTrialOpen, setIsBookTrialOpen] = useState(false);
  
  const handleBookTrial = () => {
    setIsBookTrialOpen(true);
  };
  
  const isStudent = user?.role === 'student';
  
  // Define badge color based on course type
  const getCourseTypeBadge = () => {
    switch (course.course_type) {
      case 'solo':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
          <UserCircle2 className="h-3 w-3 mr-1" />
          Individual
        </Badge>;
      case 'duo':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
          <Users className="h-3 w-3 mr-1" />
          Pair
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <Users className="h-3 w-3 mr-1" />
          Group
        </Badge>;
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image || '/placeholder.svg'} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold">
          Active
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
          {getCourseTypeBadge()}
        </div>
        <CardDescription className="flex items-center text-sm">
          <span className="mr-2">{getInstructorNames(course)}</span> • 
          <span className="mx-2">{course.level}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{course.description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="mr-3">{course.duration} ({course.duration_type || 'fixed'})</span>
          <Users className="h-4 w-4 mr-1" />
          <span>{course.students || 0} students</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/courses/${course.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Course
          </Button>
        </Link>
        
        {isStudent && (
          <Button 
            className="flex-1 bg-music-500 hover:bg-music-600"
            onClick={handleBookTrial}
          >
            Book Trial
          </Button>
        )}
      </CardFooter>
      
      {isBookTrialOpen && (
        <BookTrialDialog
          isOpen={isBookTrialOpen}
          onClose={() => setIsBookTrialOpen(false)}
          courseId={course.id}
          courseTitle={course.title}
        />
      )}
    </Card>
  );
};

export default CourseCard;
