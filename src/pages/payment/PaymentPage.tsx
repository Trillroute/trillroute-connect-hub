
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PaymentButton } from '@/components/PaymentButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const PaymentPage = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('order_id');
  const studentId = searchParams.get('student_id');
  const amount = searchParams.get('amount');
  
  const [courseData, setCourseData] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!courseId || !orderId || !studentId || !amount) {
        setError('Invalid payment link. Missing required parameters.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching payment data for:', { courseId, orderId, studentId, amount });
        
        // Verify the order exists and belongs to the right student and course
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

    fetchPaymentData();
  }, [courseId, orderId, studentId, amount]);
  
  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    toast.success('Payment successful!', {
      description: 'You are now enrolled in this course.'
    });
    
    // Redirect to course page after a short delay
    setTimeout(() => {
      window.location.href = `/courses/${courseId}?enrollment=success`;
    }, 2000);
  };
  
  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('Payment failed', {
      description: 'Please try again or contact support.'
    });
  };
  
  // Show loading while data is being fetched
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <p className="text-lg font-medium">Loading payment information...</p>
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
            <Button onClick={() => navigate('/courses')}>
              Browse Courses
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
              {studentData?.first_name} {studentData?.last_name}
            </p>
            <p className="text-muted-foreground text-sm">
              {studentData?.email}
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span>Course Fee</span>
              <span className="font-semibold">₹{amount}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <PaymentButton
            courseId={courseId || ''}
            amount={Number(amount) || 0}
            studentId={studentId || ''}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            className="w-full bg-[#9b87f5] text-white hover:bg-[#7E69AB]"
          >
            Pay Now ₹{amount}
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
