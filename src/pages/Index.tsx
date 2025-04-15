
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Headphones, BookOpen, Award, Star, ChevronRight, Play } from 'lucide-react';

const Index = () => {
  // Sample data
  const featuredCourses = [
    {
      id: 1,
      title: 'Piano Mastery',
      description: 'From beginner to advanced, learn to play beautiful piano pieces with proper technique.',
      instructor: 'Emily Johnson',
      level: 'All Levels',
      students: 1245,
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpYW5vfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'Guitar Fundamentals',
      description: 'Master the basics of guitar playing with practical exercises and popular songs.',
      instructor: 'David Smith',
      level: 'Beginner',
      students: 982,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3VpdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      title: 'Music Theory 101',
      description: 'Understand the language of music with this comprehensive introduction to music theory.',
      instructor: 'Robert Chen',
      level: 'Beginner',
      students: 756,
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWMlMjB0aGVvcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
  ];
  
  const testimonials = [
    {
      id: 1,
      text: 'Trillroute transformed my musical journey. The teachers are world-class and I've improved more in 3 months than I did in years of self-teaching.',
      author: 'Sarah M.',
      role: 'Piano Student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      text: 'The flexibility of online lessons combined with the quality of instruction is unmatched. My daughter has flourished under her violin teacher's guidance.',
      author: 'Michael T.',
      role: 'Parent of Student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      text: 'As a teacher, Trillroute provides me with all the tools I need to deliver high-quality music education. The platform is intuitive and my students love it.',
      author: 'Jessica W.',
      role: 'Guitar Instructor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
  ];
  
  const stats = [
    { id: 1, value: '10,000+', label: 'Students Taught' },
    { id: 2, value: '50+', label: 'Expert Instructors' },
    { id: 3, value: '100+', label: 'Music Courses' },
    { id: 4, value: '95%', label: 'Satisfaction Rate' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-music-300 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-music-100 text-music-800 mb-6">
                <Music className="h-4 w-4 mr-2" />
                <span>Unlock your musical potential</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Discover the Joy of <span className="text-music-500">Music</span> with Expert Guidance
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Trillroute connects you with world-class music instructors for personalized lessons and comprehensive courses tailored to your goals and skill level.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <Link to="/courses">
                  <Button className="text-white bg-music-500 hover:bg-music-600 h-12 px-8 text-lg">
                    Explore Courses
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="outline" className="h-12 px-8 text-lg border-music-300 text-music-700 hover:bg-music-50">
                    Join Now
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-2 mt-8 text-gray-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                  ))}
                </div>
                <p className="text-sm">Join <span className="font-semibold">10,000+</span> music enthusiasts</p>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-music-200 rounded-full blur-3xl opacity-30 animate-pulse-light"></div>
                <img 
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWMlMjBzdHVkaW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" 
                  alt="Music Education" 
                  className="rounded-xl shadow-2xl relative z-10 music-card-hover"
                />
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 z-20 music-card-hover">
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-500 rounded-full p-2">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Live Lessons</p>
                      <p className="text-xs text-gray-500">Interactive & Engaging</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 z-20 music-card-hover">
                  <div className="flex items-center space-x-2">
                    <div className="bg-music-500 rounded-full p-2">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Certified Teachers</p>
                      <p className="text-xs text-gray-500">Industry Professionals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Trillroute?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with exceptional teaching to provide the best music education experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border border-gray-100 rounded-xl hover:border-music-200 transition-colors music-card-hover">
              <div className="rounded-full bg-music-100 p-4 inline-block mb-4">
                <Headphones className="h-6 w-6 text-music-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from professional musicians and educators with years of performance and teaching experience.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-xl hover:border-music-200 transition-colors music-card-hover">
              <div className="rounded-full bg-music-100 p-4 inline-block mb-4">
                <BookOpen className="h-6 w-6 text-music-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Curriculum</h3>
              <p className="text-gray-600">
                Follow structured learning paths designed to build your skills progressively from beginner to advanced.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-xl hover:border-music-200 transition-colors music-card-hover">
              <div className="rounded-full bg-music-100 p-4 inline-block mb-4">
                <Music className="h-6 w-6 text-music-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                Receive individual feedback and tailored instruction to address your specific needs and goals.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-xl hover:border-music-200 transition-colors music-card-hover">
              <div className="rounded-full bg-music-100 p-4 inline-block mb-4">
                <Award className="h-6 w-6 text-music-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Opportunities</h3>
              <p className="text-gray-600">
                Showcase your progress through virtual recitals, community events, and collaborative projects.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
              <p className="text-xl text-gray-600">
                Explore our most popular music courses
              </p>
            </div>
            <Link to="/courses">
              <Button variant="link" className="text-music-500 hover:text-music-600">
                View All Courses
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 music-card-hover">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium bg-music-100 text-music-700 px-2 py-1 rounded-full">
                      {course.level}
                    </span>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
                      <span className="text-sm text-gray-600">{course.instructor}</span>
                    </div>
                    <span className="text-xs text-gray-500">{course.students} students</span>
                  </div>
                  
                  <Link to="/courses">
                    <Button className="w-full mt-4 bg-music-500 hover:bg-music-600">View Course</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who have transformed their musical abilities with Trillroute
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-6 border border-gray-100 rounded-xl music-card-hover">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-20 bg-music-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <p className="text-lg opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-music-500 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Musical Journey?</h2>
                <p className="text-xl text-white opacity-90 mb-8">
                  Join Trillroute today and discover the joy of learning music with expert guidance.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/auth/register">
                    <Button className="h-12 px-8 text-lg bg-white text-music-700 hover:bg-gray-100">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/courses">
                    <Button variant="outline" className="h-12 px-8 text-lg border-white text-white hover:bg-white/10">
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-0">
                <img 
                  src="https://images.unsplash.com/photo-1514119412350-e174d90d280e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG11c2ljJTIwc3R1ZGVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
                  alt="Music Student" 
                  className="rounded-xl md:rounded-l-2xl md:rounded-r-none w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
