
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, BarChart, LineChart } from '@/components/ui/charts';
import { Calendar, CheckCircle, Download, FileText, PlusCircle, Settings, User, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CourseManagement from '@/components/admin/CourseManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [recentUsers, setRecentUsers] = useState<Array<{
    id: number;
    name: string;
    role: string;
    email: string;
    joinDate: string;
    status: string;
  }>>([]);
  
  // Mock data for charts
  const userActivityData = [
    { name: 'Jan', Students: 45, Teachers: 8 },
    { name: 'Feb', Students: 52, Teachers: 10 },
    { name: 'Mar', Students: 61, Teachers: 12 },
    { name: 'Apr', Students: 67, Teachers: 14 },
    { name: 'May', Students: 81, Teachers: 15 },
    { name: 'Jun', Students: 87, Teachers: 17 },
    { name: 'Jul', Students: 91, Teachers: 18 },
  ];

  const enrollmentData = [
    { name: 'Piano', Students: 0 },
    { name: 'Guitar', Students: 0 },
    { name: 'Vocals', Students: 0 },
    { name: 'Violin', Students: 0 },
    { name: 'Theory', Students: 0 },
    { name: 'Drums', Students: 0 },
    { name: 'Saxophone', Students: 0 },
  ];

  const revenueData = [
    { name: 'Jan', Revenue: 0 },
    { name: 'Feb', Revenue: 0 },
    { name: 'Mar', Revenue: 0 },
    { name: 'Apr', Revenue: 0 },
    { name: 'May', Revenue: 0 },
    { name: 'Jun', Revenue: 0 },
    { name: 'Jul', Revenue: 0 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Here's an overview of Trillroute Music School.</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
            <Download className="h-4 w-4 mr-2" />
            Download Reports
          </Button>
          <Button className="bg-music-500 hover:bg-music-600">
            <Settings className="h-4 w-4 mr-2" />
            School Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Students</CardTitle>
            <CardDescription>Enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">0</div>
            <p className="text-sm text-gray-500 mt-1">No students enrolled yet</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Teachers</CardTitle>
            <CardDescription>Active instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">0</div>
            <p className="text-sm text-gray-500 mt-1">No teachers registered yet</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Courses</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">0</div>
            <p className="text-sm text-gray-500 mt-1">No active courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">$0</div>
            <p className="text-sm text-gray-500 mt-1">No revenue generated yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Management Section */}
      <div className="mb-8">
        <CourseManagement />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Students and teachers over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <AreaChart
              data={userActivityData}
              index="name"
              categories={["Students", "Teachers"]}
              colors={["music.500", "music.300"]}
              valueFormatter={(value: number) => `${value}`}
              className="h-full"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Financial performance</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart
              data={revenueData}
              index="name"
              categories={["Revenue"]}
              colors={["music.500"]}
              valueFormatter={(value: number) => `$${value.toLocaleString()}`}
              className="h-full"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Users (Empty State) */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'Teacher' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <User className="h-4 w-4" />
                            <span className="sr-only">View user</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No users yet</h3>
                <p className="text-gray-500 max-w-sm mb-4">
                  When new users register, they will appear here.
                </p>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
                View All Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by Course</CardTitle>
            <CardDescription>Student distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={enrollmentData}
              index="name"
              categories={["Students"]}
              colors={["music.500"]}
              layout="vertical"
              valueFormatter={(value: number) => `${value} students`}
              className="h-full"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="justify-start bg-music-500 hover:bg-music-600">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="justify-start bg-music-500 hover:bg-music-600">
              <FileText className="h-4 w-4 mr-2" />
              Manage Courses
            </Button>
            <Button className="justify-start bg-music-500 hover:bg-music-600">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Management
            </Button>
            <Button className="justify-start bg-music-500 hover:bg-music-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
