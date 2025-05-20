
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const createRazorpayOrder = async (amount: number, courseId: string, userId: string) => {
  try {
    console.log(`Creating Razorpay order for user ${userId}, course ${courseId}, amount ${amount}`);
    
    // Check if all required parameters are provided
    if (!amount || !courseId || !userId) {
      console.error('Missing required parameters:', { amount, courseId, userId });
      toast.error('Missing payment information');
      return null;
    }
    
    // Call the edge function to create the order
    const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount, courseId, userId }
    });

    if (orderError) {
      console.error('Error creating order:', orderError);
      toast.error('Payment gateway error', {
        description: 'Please check Razorpay API configuration'
      });
      return null;
    }

    // Additional check for edge function response format
    if (!orderData) {
      console.error('No data received from edge function');
      toast.error('Payment gateway configuration error');
      return null;
    }
    
    // Check if we got an error message in the response
    if (orderData.error) {
      console.error('Error in edge function response:', orderData.error);
      toast.error('Razorpay API error', {
        description: orderData.message || 'Please check your API keys'
      });
      return null;
    }

    // Validate the required fields in the order data
    if (!orderData.orderId || !orderData.key) {
      console.error('Invalid order data received:', orderData);
      toast.error('Payment gateway configuration error', {
        description: 'Please check Razorpay API keys'
      });
      return null;
    }

    console.log('Order created successfully:', orderData.orderId);
    return orderData;
  } catch (error) {
    console.error('Exception in createRazorpayOrder:', error);
    toast.error('Payment system error', {
      description: 'Please try again later or contact support'
    });
    return null;
  }
};

export const verifyPayment = async (response: RazorpayHandlerResponse, courseId: string, userId: string) => {
  console.log('Payment verification response:', response);
  
  try {
    // For QR code payments, we generate pseudo-IDs if they're not present
    const isQrPayment = !response.razorpay_payment_id || response.razorpay_payment_id.startsWith('qr_payment_');
    
    const verificationData = {
      razorpay_payment_id: response.razorpay_payment_id || `qr_payment_${Date.now()}`,
      razorpay_order_id: response.razorpay_order_id || `qr_order_${Date.now()}`,
      razorpay_signature: response.razorpay_signature || '',
      user_id: userId,
      course_id: courseId,
      is_qr_payment: isQrPayment
    };

    console.log('Sending verification data to backend:', verificationData);

    // Call verify-razorpay-payment edge function
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: verificationData
    });
    
    if (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment Verification Failed', {
        description: 'Please contact support if payment was deducted'
      });
      throw error;
    }

    console.log('Payment verification success:', data);
    
    if (isQrPayment) {
      // For QR payments, we'll let the UI handle the redirect
      // after polling for enrollment status
      console.log('QR payment verification sent, UI will handle redirect');
      return data;
    } else {
      // For regular payments, redirect immediately
      const redirectUrl = `/courses/${courseId}?enrollment=success&payment=verified`;
      window.location.href = redirectUrl;
      return data;
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    // For regular payments, still redirect since payment might have succeeded
    // For QR payments, let the caller handle the error
    if (!response.razorpay_payment_id?.startsWith('qr_payment_')) {
      window.location.href = `/courses/${courseId}?enrollment=success`;
    }
    throw error;
  }
};
