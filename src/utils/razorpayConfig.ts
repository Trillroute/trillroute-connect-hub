
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
    // For QR code payments, we generate pseudo-IDs if they're not present
    const verificationData = {
      razorpay_payment_id: response.razorpay_payment_id || `qr_payment_${Date.now()}`,
      razorpay_order_id: response.razorpay_order_id || `qr_order_${Date.now()}`,
      razorpay_signature: response.razorpay_signature || '',
      user_id: userId,
      course_id: courseId
    };

    // Call verify-razorpay-payment edge function
    const { error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: verificationData
    });
    
    if (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment Verification Failed', {
        description: 'Please contact support if payment was deducted'
      });
      return;
    }
    
    // Redirect to success page with verification status
    const redirectUrl = `/courses/${courseId}?enrollment=success&payment=verified`;
    window.location.href = redirectUrl;
  } catch (error) {
    console.error('Payment verification error:', error);
    // Still redirect since payment might have succeeded
    window.location.href = `/courses/${courseId}?enrollment=success`;
  }
};
