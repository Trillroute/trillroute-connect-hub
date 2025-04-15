
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Users, Clock, BookOpen } from 'lucide-react';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Empty courses array - removed all dummy data
  const allCourses = [];
  
  // Filter courses based on search term
  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group courses by category for the tabs
  const coursesByCategory = {
    all: filteredCourses,
    piano: filteredCourses.filter(course => course.category === 'Piano'),
    guitar: filteredCourses.filter(course => course.category === 'Guitar'),
    strings: filteredCourses.filter(course => course.category === 'Strings'),
    voice: filteredCourses.filter(course => course.category === 'Voice'),
    theory: filteredCourses.filter(course => course.category === 'Theory'),
    percussion: filteredCourses.filter(course => course.category === 'Percussion'),
    jazz: filteredCourses.filter(course => course.category === 'Jazz'),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Music Courses</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover a wide range of music courses taught by professional instructors to help you achieve your musical goals.
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for courses, instructors, or topics..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline">Level</Button>
          <Button variant="outline">Duration</Button>
          <Button variant="outline">Rating</Button>
        </div>
      </div>
      
      {/* Course Categories Tabs */}
      <Tabs defaultValue="all">
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="piano">Piano</TabsTrigger>
            <TabsTrigger value="guitar">Guitar</TabsTrigger>
            <TabsTrigger value="strings">Strings</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="percussion">Percussion</TabsTrigger>
            <TabsTrigger value="jazz">Jazz</TabsTrigger>
          </TabsList>
        </div>
        
        {Object.entries(coursesByCategory).map(([category, courses]) => (
          <TabsContent key={category} value={category}>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Course cards would be mapped here if there were any courses */}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">No courses are currently available. Check back soon!</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Courses;
