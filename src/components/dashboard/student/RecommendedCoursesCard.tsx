
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecommendedCourse } from '@/types/student-dashboard';

interface RecommendedCoursesCardProps {
  courses: RecommendedCourse[];
}

export const RecommendedCoursesCard = ({ courses }: RecommendedCoursesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>Based on your interests</CardDescription>
      </CardHeader>
      <CardContent>
        {courses.length > 0 ? (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex rounded-lg overflow-hidden border border-gray-100 hover:border-music-200 transition-colors">
                <div className="h-24 w-24 flex-shrink-0">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 flex-grow">
                  <h5 className="font-medium text-sm">{course.title}</h5>
                  <p className="text-xs text-gray-600">{course.instructor}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs ml-1">{course.rating} • {course.level}</span>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/courses">
              <Button variant="link" className="w-full text-music-500">
                View All Recommendations
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No recommendations yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-4">
              We'll suggest courses based on your interests as you explore our platform.
            </p>
            <Link to="/courses">
              <Button variant="link" className="w-full text-music-500">
                Browse All Courses
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
