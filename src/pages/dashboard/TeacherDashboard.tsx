
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckCircle, Clock, Edit, PlusCircle, Users, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeacherDashboard = () => {
  const { user } = useAuth();

  // Mock data
  const upcomingSessions = [
    { 
      id: 1, 
      title: 'Piano Fundamentals - Week 3', 
      type: 'Group Class',
      students: 12,
      date: '2023-09-12', 
      time: '10:00 AM', 
      duration: '60 min' 
    },
    { 
      id: 2, 
      title: 'Private Lesson - Sarah Thompson', 
      type: 'One-on-One',
      students: 1,
      date: '2023-09-12', 
      time: '01:30 PM', 
      duration: '45 min' 
    },
    { 
      id: 3, 
      title: 'Advanced Theory Workshop', 
      type: 'Group Class',
      students: 8,
      date: '2023-09-13', 
      time: '11:00 AM', 
      duration: '90 min' 
    },
  ];

  const activeCourses = [
    { 
      id: 1, 
      title: 'Piano Fundamentals', 
      students: 23, 
      rating: 4.8,
      totalLessons: 12,
      completedLessons: 6,
      lastUpdated: '1 day ago',
    },
    { 
      id: 2, 
      title: 'Music Theory 101', 
      students: 18, 
      rating: 4.9,
      totalLessons: 10,
      completedLessons: 8,
      lastUpdated: '1 week ago',
    },
    { 
      id: 3, 
      title: 'Jazz Improvisation', 
      students: 15, 
      rating: 4.7,
      totalLessons: 8,
      completedLessons: 3,
      lastUpdated: '3 days ago',
    },
  ];
  
  const recentMessages = [
    { id: 1, student: 'James Wilson', message: 'I had a question about the chord progressions in lesson 5.', time: '2 hours ago' },
    { id: 2, student: 'Emma Thompson', message: 'Just submitted my assignment for review!', time: '5 hours ago' },
    { id: 3, student: 'Michael Brown', message: 'Could we reschedule tomorrow\'s lesson?', time: '1 day ago' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Here's an overview of your teaching activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Students</CardTitle>
            <CardDescription>Currently enrolled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">56</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Courses</CardTitle>
            <CardDescription>That you teach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">{activeCourses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">{upcomingSessions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Rating</CardTitle>
            <CardDescription>From students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">4.8</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Sessions</CardTitle>
                <Button size="sm" className="bg-music-500 hover:bg-music-600">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </div>
              <CardDescription>Classes and lessons for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-music-100 h-14 w-14 rounded-full flex items-center justify-center mr-4 text-music-700">
                      {session.type === 'Group Class' ? (
                        <Users className="h-6 w-6" />
                      ) : (
                        <Video className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <div className="text-xs text-gray-600">{session.type} • {session.students} student{session.students > 1 ? 's' : ''}</div>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{session.time} • {session.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" className="bg-music-500 hover:bg-music-600">
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>From your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="p-3 rounded-lg border border-gray-100 hover:border-music-200 transition-colors">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">{message.student}</h5>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
                    <Button variant="ghost" size="sm" className="text-music-500 mt-2 p-0 h-auto">
                      Reply
                    </Button>
                  </div>
                ))}
                
                <Button variant="link" className="w-full text-music-500">
                  View All Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Courses</CardTitle>
            <Button className="bg-music-500 hover:bg-music-600">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </div>
          <CardDescription>Manage your active courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Courses</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCourses.map((course) => (
                  <Card key={course.id} className="music-card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>
                        {course.students} Students • {course.rating} Rating
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Course Progress</span>
                          <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                        </div>
                        <Progress value={(course.completedLessons / course.totalLessons) * 100} className="h-2" />
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Last updated {course.lastUpdated}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1 border-music-300 text-music-500 hover:bg-music-50">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button className="flex-1 bg-music-500 hover:bg-music-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="text-center py-10 text-gray-500">
                <div className="mb-4">No draft courses found.</div>
                <Button className="bg-music-500 hover:bg-music-600">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="text-center py-10 text-gray-500">
                <div>No archived courses found.</div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
