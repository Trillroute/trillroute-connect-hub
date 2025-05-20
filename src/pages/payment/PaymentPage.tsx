
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PaymentButton } from '@/components/PaymentButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const PaymentPage = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const studentId = searchParams.get('student_id');
  
  const [courseData, setCourseData] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !orderId || !studentId) {
        setError('Invalid payment link. Missing required parameters.');
        setLoading(false);
        return;
      }
      
      try {
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
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load payment information. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, orderId, studentId]);
  
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
          <CardFooter>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
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
