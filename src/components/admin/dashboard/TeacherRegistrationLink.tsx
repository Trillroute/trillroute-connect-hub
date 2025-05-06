
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const TeacherRegistrationLink: React.FC = () => {
  return (
    <div className="mb-4">
      <Link 
        to="/admin/teacher-registration" 
        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-music-500 text-white hover:bg-music-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-music-500 focus-visible:ring-offset-2"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Register New Teacher
      </Link>
    </div>
  );
};

export default TeacherRegistrationLink;
