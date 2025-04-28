
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { School, GraduationCap, Shield, BookOpen } from 'lucide-react';

interface AdminStatsProps {
  studentsCount: number;
  teachersCount: number;
  adminsCount: number;
  coursesCount: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  studentsCount,
  teachersCount,
  adminsCount,
  coursesCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Students</CardTitle>
          <CardDescription>Enrolled students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <School className="h-8 w-8 text-music-500 mr-3" />
            <div>
              <div className="text-3xl font-bold text-music-500">{studentsCount}</div>
              <p className="text-sm text-gray-500 mt-1">
                {studentsCount === 0 ? "No students enrolled yet" : `${studentsCount} enrolled students`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Teachers</CardTitle>
          <CardDescription>Active instructors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-music-500 mr-3" />
            <div>
              <div className="text-3xl font-bold text-music-500">{teachersCount}</div>
              <p className="text-sm text-gray-500 mt-1">
                {teachersCount === 0 ? "No teachers registered yet" : `${teachersCount} active teachers`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Admins</CardTitle>
          <CardDescription>All administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-music-500 mr-3" />
            <div>
              <div className="text-3xl font-bold text-music-500">{adminsCount}</div>
              <p className="text-sm text-gray-500 mt-1">
                {adminsCount === 0 ? "No admins registered yet" : `${adminsCount} active admins`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Courses</CardTitle>
          <CardDescription>All courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-music-500 mr-3" />
            <div>
              <div className="text-3xl font-bold text-music-500">{coursesCount}</div>
              <p className="text-sm text-gray-500 mt-1">
                {coursesCount === 0 ? "No courses created yet" : `${coursesCount} total courses`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
