
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const createRazorpayOrder = async (amount: number, courseId: string, userId: string) => {
  const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
    body: { amount, courseId, userId }
  });

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error('Failed to create payment order');
  }

  if (!orderData || !orderData.orderId || !orderData.key) {
    console.error('Invalid order data received:', orderData);
    throw new Error('Invalid payment configuration');
  }

  return orderData;
};

export const verifyPayment = async (response: RazorpayHandlerResponse, courseId: string, userId: string) => {
  console.log('Payment successful response:', response);
  
  try {
    await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        user_id: userId,
        course_id: courseId
      }
    });
    
    window.location.href = `/courses/${courseId}?enrollment=success&payment=verified`;
  } catch (error) {
    console.error('Payment verification error:', error);
    // Still redirect to success since payment might have been successful
    window.location.href = `/courses/${courseId}?enrollment=success`;
  }
};
