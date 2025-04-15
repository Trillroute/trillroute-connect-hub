
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Users, Clock, BookOpen } from 'lucide-react';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mocked course data
  const allCourses = [
    {
      id: 1,
      title: 'Piano Fundamentals',
      description: 'Learn the basics of piano playing with proper technique and music reading skills.',
      instructor: 'Emily Johnson',
      category: 'Piano',
      level: 'Beginner',
      duration: '8 weeks',
      students: 245,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpYW5vfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'Advanced Piano Techniques',
      description: 'Take your piano skills to the next level with advanced techniques and repertoire.',
      instructor: 'Michael Brown',
      category: 'Piano',
      level: 'Advanced',
      duration: '10 weeks',
      students: 178,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGlhbm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      title: 'Guitar for Beginners',
      description: 'Start your guitar journey with fundamental chords, strumming patterns, and easy songs.',
      instructor: 'David Smith',
      category: 'Guitar',
      level: 'Beginner',
      duration: '6 weeks',
      students: 312,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3VpdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      title: 'Intermediate Guitar',
      description: 'Build upon your guitar basics with more complex chords, scales, and song arrangements.',
      instructor: 'James Wilson',
      category: 'Guitar',
      level: 'Intermediate',
      duration: '8 weeks',
      students: 245,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGd1aXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 5,
      title: 'Violin Essentials',
      description: 'Learn proper violin technique, posture, and basic repertoire for beginners.',
      instructor: 'Sarah Thompson',
      category: 'Strings',
      level: 'Beginner',
      duration: '10 weeks',
      students: 167,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmlvbGlufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 6,
      title: 'Vocal Training Essentials',
      description: 'Develop your singing voice with proper breathing techniques, vocal exercises, and performance skills.',
      instructor: 'Maria Garcia',
      category: 'Voice',
      level: 'All Levels',
      duration: '8 weeks',
      students: 289,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2luZ2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 7,
      title: 'Music Theory 101',
      description: 'Understand the fundamental concepts of music theory including notation, scales, intervals, and chords.',
      instructor: 'Robert Chen',
      category: 'Theory',
      level: 'Beginner',
      duration: '6 weeks',
      students: 354,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWMlMjB0aGVvcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 8,
      title: 'Drum Basics',
      description: 'Master the fundamentals of drumming with proper technique and rhythm exercises.',
      instructor: 'Jason Miller',
      category: 'Percussion',
      level: 'Beginner',
      duration: '8 weeks',
      students: 198,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHJ1bXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 9,
      title: 'Jazz Improvisation',
      description: 'Learn the art of jazz improvisation with scales, patterns, and stylistic elements.',
      instructor: 'Thomas Rodriguez',
      category: 'Jazz',
      level: 'Intermediate',
      duration: '10 weeks',
      students: 143,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amF6eiUyMG11c2ljfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
  ];
  
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden music-card-hover">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium bg-music-100 text-music-700 px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-music-500 hover:bg-music-600">View Course</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {courses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Courses;
