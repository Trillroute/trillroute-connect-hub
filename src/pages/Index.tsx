
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Headphones, BookOpen, Award, ChevronRight, Play } from 'lucide-react';

const Index = () => {
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
              
              {/* Removed the "Join 10000+ music enthusiasts" element */}
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
      
      {/* Removed Featured Courses Section */}
      
      {/* Removed Testimonials Section */}
      
      {/* Stats - Removed mock values */}
      <section className="py-20 bg-music-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Musical Community</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Experience the transformative power of music education with Trillroute's expert instruction and supportive community.
            </p>
          </div>
        </div>
      </section>
      
      {/* Removed CTA Section */}
    </div>
  );
};

export default Index;
