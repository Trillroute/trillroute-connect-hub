
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Music2 } from 'lucide-react';
import { UpcomingLesson } from '@/types/student-dashboard';

interface UpcomingLessonsCardProps {
  lessons: UpcomingLesson[];
}

export const UpcomingLessonsCard = ({ lessons }: UpcomingLessonsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Lessons</CardTitle>
        <CardDescription>Your scheduled sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-music-200 h-14 w-14 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-music-700" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                  <p className="text-sm text-gray-600">with {lesson.instructor}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(lesson.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{lesson.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Music2 className="h-3 w-3 mr-1" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-music-500 text-white hover:bg-music-600">
                  Join
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">Schedule a New Lesson</Button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming lessons</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-4">
              You don't have any scheduled lessons. Book a lesson with one of our instructors.
            </p>
            <Button variant="outline" className="w-full">Schedule a New Lesson</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
