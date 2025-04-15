
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, Music2, PlayCircle, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Mock data for the UI
  const enrolledCourses = [
    { 
      id: 1, 
      title: 'Piano Fundamentals', 
      instructor: 'Emily Johnson', 
      progress: 45,
      nextLesson: 'Understanding Chord Progressions',
      imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpYW5vfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 2, 
      title: 'Guitar for Beginners', 
      instructor: 'David Smith', 
      progress: 70,
      nextLesson: 'Basic Strumming Patterns',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3VpdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 3, 
      title: 'Music Theory 101', 
      instructor: 'Robert Chen', 
      progress: 30,
      nextLesson: 'Understanding Time Signatures',
      imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWMlMjB0aGVvcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
  ];

  const upcomingLessons = [
    { id: 1, title: 'Piano Practice Session', instructor: 'Emily Johnson', date: '2023-09-12', time: '10:00 AM', duration: '45 minutes' },
    { id: 2, title: 'Guitar Technique Workshop', instructor: 'David Smith', date: '2023-09-14', time: '02:30 PM', duration: '1 hour' },
  ];

  const recommendations = [
    { 
      id: 1, 
      title: 'Vocal Training Essentials', 
      instructor: 'Sarah Williams', 
      level: 'Intermediate',
      rating: 4.8,
      students: 1245,
      imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2luZ2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 2, 
      title: 'Advanced Piano Techniques', 
      instructor: 'Michael Brown', 
      level: 'Advanced',
      rating: 4.9,
      students: 837,
      imageUrl: 'https://images.unsplash.com/photo-1530190058431-68547e914cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGlhbm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your musical journey with Trillroute.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Enrolled Courses</CardTitle>
            <CardDescription>Your active courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">{enrolledCourses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Lessons</CardTitle>
            <CardDescription>Your learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Practice Hours</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">24.5</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden music-card-hover">
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
                
                <Button variant="outline" className="w-full border-music-300 text-music-500 hover:bg-music-50">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lessons</CardTitle>
              <CardDescription>Your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLessons.map((lesson) => (
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
                
                {upcomingLessons.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming lessons scheduled.
                  </div>
                )}
                
                <Button variant="outline" className="w-full">Schedule a New Lesson</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Based on your interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((course) => (
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
                
                <Button variant="link" className="w-full text-music-500">
                  View All Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
