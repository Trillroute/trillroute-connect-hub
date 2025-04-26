
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TeacherCoursesSection = () => {
  const { myCourses, myCoursesLoading } = useTeacherCourses();

  if (myCoursesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (myCourses.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6 text-center">
          <p className="mb-4 text-muted-foreground">You are not assigned to any courses yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {myCourses.map(course => (
        <Card key={course.id} className="overflow-hidden">
          <CardHeader className="bg-card border-b pb-3">
            <CardTitle className="text-lg font-medium">{course.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {course.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                <span>Students: {course.students || 0}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link to={`/courses/${course.id}`}>
                    <ExternalLink className="mr-1 h-4 w-4" />
                    View Course
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeacherCoursesSection;
