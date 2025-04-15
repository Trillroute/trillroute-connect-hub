
import React from 'react';
import { Music, Award, Users, Landmark, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Dr. Emily Johnson',
      role: 'Founder & Music Director',
      bio: 'Concert pianist with over 20 years of teaching experience and a doctorate in Music Education from Juilliard.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Michael Chang',
      role: 'Head of Guitar Department',
      bio: 'Classical and jazz guitarist who has toured internationally and taught at prestigious music conservatories.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2Zlc3Npb25hbCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Sarah Williams',
      role: 'Vocal Department Chair',
      bio: 'Opera singer and vocal coach with experience on Broadway and a passion for developing young voices.',
      image: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Dr. Robert Chen',
      role: 'Theory & Composition Director',
      bio: 'Composer and music theorist with published works and a PhD in Music Composition from Yale University.',
      image: 'https://images.unsplash.com/photo-1605664042097-e22dd8847003?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2Zlc3Npb25hbCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
  ];
  
  // Milestones data
  const milestones = [
    {
      year: '2015',
      title: 'Founding of Trillroute',
      description: 'Established with a vision to provide accessible, high-quality music education to students worldwide.'
    },
    {
      year: '2017',
      title: 'Launch of Online Platform',
      description: 'Expanded beyond local teaching to reach students globally through our innovative online learning system.'
    },
    {
      year: '2019',
      title: 'Accreditation & Recognition',
      description: 'Received accreditation from the National Association of Schools of Music and industry recognition.'
    },
    {
      year: '2021',
      title: 'Curriculum Expansion',
      description: 'Expanded our course offerings to include over 100 specialized courses across all major instruments and music disciplines.'
    },
    {
      year: '2023',
      title: 'Global Impact Milestone',
      description: 'Reached the milestone of teaching 10,000+ students from over 50 countries around the world.'
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-music-100 text-music-800 mb-6">
            <Music className="h-4 w-4 mr-2" />
            <span>Our Story</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-music-500">Trillroute</span> Music School
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We're on a mission to transform music education through accessibility, excellence, and innovation.
          </p>
          
          <div className="max-w-3xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Trillroute Music School" 
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>
      
      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission & Values</h2>
            <p className="text-xl text-gray-600">
              At Trillroute, we believe that music education should be accessible, personalized, and transformative. 
              Our mission is to empower students of all ages, backgrounds, and skill levels to discover the joy of music 
              and develop their unique musical voice.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-100 rounded-xl hover:border-music-200 transition-colors music-card-hover">
              <div className="rounded-full bg-music-100 p-4 inline-block mb-4">
                <Award className="h-6 w-6 text-music-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We are committed to upholding the highest standards in music education through our curriculum, 
                teachers, and learning environment.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-100 rounded-xl hover:border-music-200 transition-colors music-card-hover">
              <div className="rounded-full bg-music-100 p-4 inline-block mb-4">
                <Users className="h-6 w-6 text-music-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                We celebrate diversity and create a welcoming environment where all students feel valued and supported 
                in their musical journey.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-100 rounded-xl hover:border-music-200 transition-colors music-card-hover">
              <div className="rounded-full bg-music-100 p-4 inline-block mb-4">
                <Heart className="h-6 w-6 text-music-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600">
                We nurture a deep love for music and inspire our students to connect with the 
                emotional and expressive aspects of their art.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">Our Journey</h2>
          
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-music-300"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className={`bg-white p-6 rounded-xl shadow-md ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} max-w-md music-card-hover`}>
                    <h3 className="text-2xl font-bold text-music-500 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-full border-4 border-music-500 bg-white flex items-center justify-center text-sm font-bold">
                    {milestone.year.substring(2)}
                  </div>
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Meet Our Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">Meet Our Team</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Our talented faculty brings together years of performance experience and teaching excellence to provide the best music education.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center music-card-hover">
                <div className="relative mb-4 overflow-hidden rounded-full h-48 w-48 mx-auto">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="object-cover h-full w-full transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-music-500 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  <button className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-music-400 hover:text-music-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                    </svg>
                  </button>
                  <button className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-music-400 hover:text-music-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                  </button>
                  <button className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-music-400 hover:text-music-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Campus / Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">Our Facilities</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            We provide state-of-the-art facilities to enhance the learning experience of our students.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="overflow-hidden rounded-xl shadow-lg music-card-hover">
              <img 
                src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpYW5vfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" 
                alt="Piano Studio" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Piano Studios</h3>
                <p className="text-gray-600">
                  Our piano studios feature Steinway grand pianos in acoustically-optimized rooms designed for 
                  optimal sound quality during lessons and practice sessions.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <div className="overflow-hidden rounded-xl shadow-lg music-card-hover">
                <img 
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWMlMjBzdHVkaW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" 
                  alt="Recording Studio" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Recording Studios</h3>
                  <p className="text-sm text-gray-600">
                    Professional-grade recording facilities for student projects and performances.
                  </p>
                </div>
              </div>
              
              <div className="overflow-hidden rounded-xl shadow-lg music-card-hover">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uY2VydCUyMGhhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" 
                  alt="Concert Hall" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Concert Hall</h3>
                  <p className="text-sm text-gray-600">
                    A beautiful 200-seat venue for student recitals and faculty performances.
                  </p>
                </div>
              </div>
              
              <div className="overflow-hidden rounded-xl shadow-lg music-card-hover">
                <img 
                  src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBjbGFzc3Jvb218ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" 
                  alt="Classrooms" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Group Classrooms</h3>
                  <p className="text-sm text-gray-600">
                    Spacious rooms for group lessons, ensembles, and workshops.
                  </p>
                </div>
              </div>
              
              <div className="overflow-hidden rounded-xl shadow-lg music-card-hover">
                <img 
                  src="https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG11c2ljJTIwYm9va3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" 
                  alt="Music Library" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Music Library</h3>
                  <p className="text-sm text-gray-600">
                    Extensive collection of sheet music, books, and digital resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Join the Trillroute Community</h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're a beginner taking your first steps in music or an advanced student looking to refine your skills, 
              we have the perfect program to help you achieve your musical goals.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/courses">
                <Button className="h-12 px-8 text-lg bg-music-500 hover:bg-music-600">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Courses
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="h-12 px-8 text-lg border-music-300 text-music-700 hover:bg-music-50">
                  <Landmark className="h-5 w-5 mr-2" />
                  Visit Campus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
