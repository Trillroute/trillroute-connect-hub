
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import RegisterForm from '@/components/auth/RegisterForm';
import StudentRegistration from './StudentRegistration';

const Register = () => {
  // Get the role from the URL or context if needed
  const { user } = useAuth();
  const role = user?.role || 'teacher';
  
  // Only redirect to StudentRegistration if role is student
  if (role === 'student') {
    return <StudentRegistration />;
  }

  return <RegisterForm />;
};

export default Register;
