
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckCircle, Clock, Edit, PlusCircle, Users, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeacherDashboard = () => {
  const { user } = useAuth();

  // Empty arrays - removed all mock data
  const upcomingSessions: {
    id: number;
    title: string;
    type: string;
    students: number;
    date: string;
    time: string;
    duration: string;
  }[] = [];

  const activeCourses: {
    id: number;
    title: string;
    students: number;
    rating: number;
    totalLessons: number;
    completedLessons: number;
    lastUpdated: string;
  }[] = [];
  
  const recentMessages: {
    id: number;
    student: string;
    message: string;
    time: string;
  }[] = [];

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
            <div className="text-3xl font-bold text-music-500">0</div>
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
            <div className="text-3xl font-bold text-music-500">0</div>
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
              {upcomingSessions.length > 0 ? (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming sessions</h3>
                  <p className="text-gray-500 max-w-sm mb-4">
                    You don't have any scheduled sessions. Create a session to get started.
                  </p>
                  <Button size="sm" className="bg-music-500 hover:bg-music-600">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Session
                  </Button>
                </div>
              )}
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
              {recentMessages.length > 0 ? (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Users className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No messages</h3>
                  <p className="text-gray-500 max-w-sm mb-4">
                    You haven't received any messages from students yet.
                  </p>
                </div>
              )}
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
              {activeCourses.length > 0 ? (
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
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <div className="mb-4">No active courses found.</div>
                  <Button className="bg-music-500 hover:bg-music-600">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Course
                  </Button>
                </div>
              )}
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
