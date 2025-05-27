
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PaymentButton } from '@/components/PaymentButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const PaymentPage = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const orderId = searchParams.get('order_id');
  const studentId = searchParams.get('student_id');
  const amount = searchParams.get('amount');
  
  const [courseData, setCourseData] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionRetryCount, setSessionRetryCount] = useState(0);
  const MAX_RETRY_COUNT = 5;
  
  // Enhanced session checking with retries
  useEffect(() => {
    const checkAuthWithRetry = async () => {
      console.log('PaymentPage auth check:', { 
        user: user?.id, 
        studentId, 
        authLoading,
        retryCount: sessionRetryCount 
      });
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }
      
      // If no user and we haven't exceeded retry count, try to get session directly
      if (!user && sessionRetryCount < MAX_RETRY_COUNT) {
        console.log('No user in context, checking Supabase session directly...');
        
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            // Retry after a short delay
            setTimeout(() => {
              setSessionRetryCount(prev => prev + 1);
            }, 1000);
            return;
          }
          
          if (!session?.user) {
            console.log('No session found, retrying...');
            // Retry after a short delay
            setTimeout(() => {
              setSessionRetryCount(prev => prev + 1);
            }, 1000);
            return;
          }
          
          console.log('Found session, verifying against student ID:', {
            sessionUserId: session.user.id,
            studentId
          });
          
          // Verify session user matches student ID
          if (session.user.id !== studentId) {
            console.error('Session user mismatch:', {
              sessionUser: session.user.id,
              expectedStudent: studentId
            });
            setError('Payment link is not valid for the current session. Please ensure you are logged in with the correct account.');
            setLoading(false);
            return;
          }
          
          // Session matches, proceed with data fetch
          console.log('Session verified, proceeding with payment data fetch');
          await fetchPaymentData(session.user);
          return;
          
        } catch (error) {
          console.error('Error checking session:', error);
          // Retry after a short delay
          setTimeout(() => {
            setSessionRetryCount(prev => prev + 1);
          }, 1000);
          return;
        }
      }
      
      // If we have exceeded retry count and still no user
      if (!user && sessionRetryCount >= MAX_RETRY_COUNT) {
        console.log('Max retries exceeded, redirecting to login');
        toast.error('Please log in to complete your payment');
        navigate('/auth/login');
        return;
      }
      
      // If we have a user, verify it matches the student ID
      if (user) {
        if (user.id !== studentId) {
          console.error('User ID mismatch:', { 
            loggedInUser: user.id, 
            paymentStudentId: studentId 
          });
          setError('Payment link is not valid for the current user. Please ensure you are logged in with the correct account.');
          setLoading(false);
          return;
        }
        
        // User matches, proceed with data fetch
        await fetchPaymentData(user);
      }
    };
    
    checkAuthWithRetry();
  }, [user, authLoading, studentId, navigate, sessionRetryCount]);
  
  const fetchPaymentData = async (currentUser?: any) => {
    if (!courseId || !orderId || !studentId) {
      setError('Invalid payment link. Missing required parameters.');
      setLoading(false);
      return;
    }
    
    const userToUse = currentUser || user;
    if (!userToUse) {
      setError('User authentication required.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching payment data for:', { courseId, orderId, studentId });
      
      // Verify the order exists and belongs to the current user
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .eq('user_id', studentId)
        .eq('course_id', courseId)
        .single();
      
      if (orderError || !orderData) {
        console.error('Order verification failed:', orderError);
        throw new Error('Payment order not found or invalid');
      }
      
      console.log('Order verified:', orderData);
      
      // Fetch course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('title, description, final_price, image')
        .eq('id', courseId)
        .single();
        
      if (courseError || !course) {
        throw new Error('Course not found');
      }
      
      // Fetch student details
      const { data: student, error: studentError } = await supabase
        .from('custom_users')
        .select('first_name, last_name, email')
        .eq('id', studentId)
        .single();
        
      if (studentError || !student) {
        throw new Error('Student not found');
      }
      
      // Get current user email for comparison
      const currentUserEmail = userToUse.email;
      if (student.email !== currentUserEmail) {
        throw new Error('Student email does not match logged-in user');
      }
      
      setCourseData(course);
      setStudentData(student);
      console.log('Payment data loaded successfully');
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Failed to load payment information. Please contact support.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    toast.success('Payment successful!', {
      description: 'You are now enrolled in this course.'
    });
    
    // Redirect to course page
    window.location.href = `/courses/${courseId}?enrollment=success`;
  };
  
  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('Payment failed', {
      description: 'Please try again or contact support.'
    });
  };
  
  // Show loading while authentication is being checked
  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <p className="text-lg font-medium">
          {authLoading ? 'Verifying authentication...' : 'Loading payment information...'}
        </p>
        {sessionRetryCount > 0 && sessionRetryCount < MAX_RETRY_COUNT && (
          <p className="text-sm text-muted-foreground mt-2">
            Checking session... (attempt {sessionRetryCount + 1}/{MAX_RETRY_COUNT})
          </p>
        )}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-red-500">Payment Error</h1>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/auth/login')}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold">Complete Your Enrollment</h1>
          <p className="text-muted-foreground">Course Payment</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {courseData?.image && (
            <div className="aspect-video overflow-hidden rounded-md">
              <img 
                src={courseData.image} 
                alt={courseData.title}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold">{courseData?.title}</h2>
            <p className="text-muted-foreground line-clamp-2 mt-1">
              {courseData?.description}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Student Details</p>
            <p className="text-muted-foreground">
              {studentData?.first_name} {studentData?.last_name} ({studentData?.email})
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span>Course Fee</span>
              <span className="font-semibold">₹{courseData?.final_price || 0}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <PaymentButton
            courseId={courseId || ''}
            amount={courseData?.final_price || 0}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            className="w-full bg-[#9b87f5] text-white hover:bg-[#7E69AB]"
          >
            Pay Now ₹{courseData?.final_price || 0}
          </PaymentButton>
          
          <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;
