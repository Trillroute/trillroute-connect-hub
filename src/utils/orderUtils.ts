
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the status of an order from the Supabase database
 */
export const getOrderStatus = async (orderId: string) => {
  try {
    console.log('Fetching order status:', orderId);
    
    const { data, error } = await supabase
      .from('orders')
      .select('status, amount, metadata')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order status');
    }

    console.log('Order data:', data);
    return data;
  } catch (error) {
    console.error('Exception in getOrderStatus:', error);
    throw error;
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

/**
 * Check if a payment has been processed for a specific course and user
 */
export const checkPaymentProcessed = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    console.log(`Checking if payment has been processed for course ${courseId} and user ${userId}`);
    
    // First check payments table
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('status')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .maybeSingle();
      
    if (paymentError) {
      console.error('Error checking payment status:', paymentError);
    } else if (paymentData) {
      console.log('Found completed payment in payments table');
      return true;
    }
    
    // Then check orders table as fallback
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
    console.log(`Payment processed status: ${isProcessed}`);
    return isProcessed;
  } catch (error) {
    console.error('Exception checking payment status:', error);
    return false;
  }
};
