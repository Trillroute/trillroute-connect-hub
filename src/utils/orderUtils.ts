
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a payment has been processed for a specific course and user
 */
export const checkPaymentProcessed = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    console.log(`Checking if payment has been processed for course ${courseId} and user ${userId}`);
    
    // Check payments table
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('status')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .maybeSingle();
      
    if (paymentError) {
      console.error('Error checking payment status:', paymentError);
      return false;
    }
    
    if (paymentData) {
      console.log('Payment found in database with status:', paymentData.status);
      return true;
    }
    
    // If no direct payment record found, check if user is already enrolled
    // This implies payment was successful
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('Error checking course enrollment:', courseError);
      return false;
    }
    
    const studentIds = courseData?.student_ids || [];
    const isAlreadyEnrolled = studentIds.includes(userId);
    
    console.log(`User enrollment check in course: ${isAlreadyEnrolled}`);
    
    // If already enrolled, payment is considered processed
    if (isAlreadyEnrolled) {
      return true;
    }
    
    // Last resort: Check orders table for any successfully processed order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('status')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .maybeSingle();
    
    if (orderError) {
      console.error('Error checking order status:', orderError);
      return false;
    }
    
    const isProcessed = !!orderData;
    console.log(`Payment processed status based on orders: ${isProcessed}`);
    return isProcessed;
  } catch (error) {
    console.error('Exception checking payment status:', error);
    return false;
  }
};

/**
 * Get detailed Razorpay order information via the edge function
 */
export const getRazorpayOrderDetails = async (orderId: string) => {
  try {
    console.log('Fetching Razorpay order details for:', orderId);
    
    const { data, error } = await supabase.functions.invoke('get-razorpay-order-details', {
      body: { orderId }
    });
    
    if (error) {
      console.error('Error fetching Razorpay order details:', error);
      throw error;
    }

    console.log('Razorpay order details received:', data);
    return data;
  } catch (error) {
    console.error('Exception fetching Razorpay order details:', error);
    throw error;
  }
};
