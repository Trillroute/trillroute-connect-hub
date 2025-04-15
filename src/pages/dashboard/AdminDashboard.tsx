
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, BarChart, LineChart } from '@/components/ui/chart';
import { Calendar, CheckCircle, Download, FileText, PlusCircle, Settings, User, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const { user } = useAuth();
  
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
    { name: 'Piano', Students: 125 },
    { name: 'Guitar', Students: 98 },
    { name: 'Vocals', Students: 64 },
    { name: 'Violin', Students: 47 },
    { name: 'Theory', Students: 38 },
    { name: 'Drums', Students: 43 },
    { name: 'Saxophone', Students: 29 },
  ];

  const revenueData = [
    { name: 'Jan', Revenue: 12500 },
    { name: 'Feb', Revenue: 14200 },
    { name: 'Mar', Revenue: 15800 },
    { name: 'Apr', Revenue: 16900 },
    { name: 'May', Revenue: 19500 },
    { name: 'Jun', Revenue: 21200 },
    { name: 'Jul', Revenue: 22800 },
  ];

  // Mock data for recent users
  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', role: 'Student', email: 'sarah.j@example.com', joinDate: '2023-09-10', status: 'Active' },
    { id: 2, name: 'David Williams', role: 'Teacher', email: 'david.w@example.com', joinDate: '2023-09-09', status: 'Active' },
    { id: 3, name: 'Emma Thompson', role: 'Student', email: 'emma.t@example.com', joinDate: '2023-09-08', status: 'Pending' },
    { id: 4, name: 'Michael Brown', role: 'Student', email: 'michael.b@example.com', joinDate: '2023-09-07', status: 'Active' },
    { id: 5, name: 'Jessica Smith', role: 'Teacher', email: 'jessica.s@example.com', joinDate: '2023-09-06', status: 'Active' },
  ];

  // Mock data for recent courses
  const recentCourses = [
    { id: 1, title: 'Advanced Piano Techniques', instructor: 'Jessica Smith', students: 24, created: '2023-09-05', status: 'Active' },
    { id: 2, title: 'Guitar for Beginners', instructor: 'David Williams', students: 36, created: '2023-09-04', status: 'Active' },
    { id: 3, title: 'Music Theory 101', instructor: 'Robert Chen', students: 18, created: '2023-09-03', status: 'Active' },
    { id: 4, title: 'Vocal Training Essentials', instructor: 'Maria Garcia', students: 21, created: '2023-09-02', status: 'Draft' },
    { id: 5, title: 'Violin Masterclass', instructor: 'Emily Johnson', students: 15, created: '2023-09-01', status: 'Active' },
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
            <div className="text-3xl font-bold text-music-500">347</div>
            <p className="text-sm text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Teachers</CardTitle>
            <CardDescription>Active instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">18</div>
            <p className="text-sm text-green-500 mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Courses</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">24</div>
            <p className="text-sm text-green-500 mt-1">+3 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-music-500">$22,800</div>
            <p className="text-sm text-green-500 mt-1">+7.5% from last month</p>
          </CardContent>
        </Card>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Latest Activity</CardTitle>
              <CardDescription>Recent users and course updates</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="users" className="mt-2">
                <TabsList>
                  <TabsTrigger value="users">Recent Users</TabsTrigger>
                  <TabsTrigger value="courses">Recent Courses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="users" className="mt-4">
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
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
                      View All Users
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="courses" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{course.instructor}</TableCell>
                            <TableCell>{course.students}</TableCell>
                            <TableCell>{new Date(course.created).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {course.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View course</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
                      View All Courses
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Enrollment by Course</CardTitle>
              <CardDescription>Student distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={enrollmentData}
                  index="name"
                  categories={["Students"]}
                  colors={["music.500"]}
                  layout="vertical"
                  valueFormatter={(value: number) => `${value} students`}
                  className="h-full"
                />
              </div>
              <div className="mt-4">
                <Button className="w-full bg-music-500 hover:bg-music-600">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-music-500 hover:bg-music-600">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start bg-music-500 hover:bg-music-600">
              <FileText className="h-4 w-4 mr-2" />
              Manage Courses
            </Button>
            <Button className="w-full justify-start bg-music-500 hover:bg-music-600">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Management
            </Button>
            <Button className="w-full justify-start bg-music-500 hover:bg-music-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Applications
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="font-medium">Server Status</div>
                <div className="text-sm text-gray-500">All systems operational</div>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="font-medium">Database</div>
                <div className="text-sm text-gray-500">Healthy • 24ms response</div>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="font-medium">Storage</div>
                <div className="text-sm text-gray-500">42% used</div>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="font-medium">API Status</div>
                <div className="text-sm text-gray-500">All endpoints responsive</div>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg border border-gray-100">
              <div className="font-medium">Review New Teacher Applications</div>
              <div className="text-sm text-gray-500 mt-1">3 pending reviews</div>
              <div className="text-xs text-red-500 mt-2">Due: Today</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-100">
              <div className="font-medium">Send Monthly Newsletter</div>
              <div className="text-sm text-gray-500 mt-1">September edition</div>
              <div className="text-xs text-amber-500 mt-2">Due: Tomorrow</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-100">
              <div className="font-medium">Update Course Catalog</div>
              <div className="text-sm text-gray-500 mt-1">Add Fall semester courses</div>
              <div className="text-xs text-green-500 mt-2">Due: In 3 days</div>
            </div>
            
            <Button variant="outline" className="w-full border-music-300 text-music-500 hover:bg-music-50">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
