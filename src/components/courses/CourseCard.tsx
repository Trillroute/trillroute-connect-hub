
import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  getInstructorNames: (course: Course) => string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, getInstructorNames }) => {
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
        <CardTitle className="text-xl">{course.title}</CardTitle>
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
      <CardFooter>
        <Button className="w-full bg-music-500 hover:bg-music-600">
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
