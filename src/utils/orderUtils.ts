
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
    
    const isProcessed = !!paymentData;
    console.log(`Payment processed status: ${isProcessed}`);
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
