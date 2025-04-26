import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminPermission } from '@/utils/adminPermissions';

// Layout
import Layout from "@/components/Layout";

// Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentRegistration from "./pages/auth/StudentRegistration";

// Dashboard Pages
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";

// Admin Pages
import TeacherOnboarding from "./pages/admin/TeacherOnboarding";

// Profile Page
import Profile from "./pages/profile/Profile";

// Other
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Layout>
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              
              {/* Auth Pages */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/student-registration" element={<StudentRegistration />} />
              
              {/* Dashboard Pages */}
              <Route 
                path="/dashboard/student" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/teacher" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/superadmin" 
                element={
                  <ProtectedRoute requireSuperAdmin={true}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Pages */}
              <Route
                path="/admin/teacher-onboarding"
                element={<TeacherOnboarding />}
              />
              
              {/* Profile Page */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isProfileRoute={true}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch-all 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
