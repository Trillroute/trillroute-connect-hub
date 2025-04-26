import { serve } from "https://deno.land/std@0.188.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0'
import * as crypto from "https://deno.land/std@0.188.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.188.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

interface VerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  payment_id: string;
}

interface PaymentData {
  course_id: string;
  user_id: string;
}

// Function to create Supabase client
const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Function to verify Razorpay signature
const verifyRazorpaySignature = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  try {
    const body = orderId + "|" + paymentId;
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
    
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not defined in environment variables");
      return false;
    }
    
    console.log("Verifying signature for body:", body);
    
    const keyData = new TextEncoder().encode(secret);
    const message = new TextEncoder().encode(body);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      message
    );
    
    const generatedSignature = hexEncode(new Uint8Array(signatureBytes));
    
    console.log("Generated signature:", generatedSignature);
    console.log("Received signature:", signature);

    return generatedSignature === signature;
  } catch (error) {
    console.error("Error during signature verification:", error);
    return false;
  }
};

// Function to get payment details
const getPaymentDetails = async (supabase: any, paymentId: string): Promise<PaymentData | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('course_id, user_id')
      .eq('id', paymentId)
      .single();

    if (error || !data) {
      console.error('Error fetching payment data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPaymentDetails:', error);
    return null;
  }
};

// Function to update payment status
const updatePaymentStatus = async (
  supabase: any,
  paymentId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (error) {
      console.error('Error updating payment:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    return false;
  }
};

// Function to validate user exists in custom_users table
const validateUser = async (
  supabase: any, 
  userId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('custom_users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error('User validation error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating user:', error);
    return false;
  }
};

// Function to update course enrollment
const updateCourseEnrollment = async (
  supabase: any,
  courseId: string,
  userId: string
): Promise<boolean> => {
  try {
    // First validate that the user exists in custom_users table
    const userExists = await validateUser(supabase, userId);
    if (!userExists) {
      console.error('User does not exist in custom_users table:', userId);
      return false;
    }
    
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      return false;
    }

    const currentStudentIds = courseData.student_ids || [];
    if (currentStudentIds.includes(userId)) {
      console.log("Student already enrolled in course");
      return true;
    }

    const { error: updateError } = await supabase
      .from('courses')
      .update({
        student_ids: [...currentStudentIds, userId],
        students: (courseData.students || 0) + 1
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error updating course:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateCourseEnrollment:', error);
    return false;
  }
};

// Function to log user activity
const logUserActivity = async (
  supabase: any,
  userId: string,
  courseId: string
): Promise<void> => {
  try {
    // First validate that the user exists in custom_users table
    const userExists = await validateUser(supabase, userId);
    if (!userExists) {
      console.error('Cannot log activity - user does not exist in custom_users table:', userId);
      return;
    }
    
    const { error: logError } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action: 'payment_completed',
        component: 'course_enrollment',
        entity_id: courseId,
        page_url: '/courses/' + courseId
      });

    if (logError) {
      console.error('Error logging user activity:', logError);
    }
  } catch (error) {
    console.error('Error during activity logging:', error);
  }
};

// Function to update order status
const updateOrderStatus = async (
  supabase: any,
  orderId: string,
  status: string,
  metadata?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status: status,
        metadata: metadata,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating order:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return false;
  }
};

// Main request handler
serve(async (req) => {
  console.log("Received request to verify-razorpay-payment");
  
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: corsHeaders, 
      status: 204 
    });
  }

  const responseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json'
  };

  try {
    const requestData: VerificationRequest = await req.json();
    console.log("Received verification request with data:", requestData);

    if (!requestData.razorpay_payment_id || !requestData.razorpay_order_id || 
        !requestData.razorpay_signature || !requestData.payment_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required Razorpay verification parameters' }),
        { headers: responseHeaders, status: 400 }
      );
    }

    // Verify signature
    const isSignatureValid = await verifyRazorpaySignature(
      requestData.razorpay_order_id,
      requestData.razorpay_payment_id,
      requestData.razorpay_signature
    );

    if (!isSignatureValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment signature' }),
        { headers: responseHeaders, status: 400 }
      );
    }

    const supabase = createSupabaseClient();

    // Update order status to completed
    const orderUpdateSuccess = await updateOrderStatus(
      supabase,
      requestData.razorpay_order_id,
      'completed',
      {
        razorpay_payment_id: requestData.razorpay_payment_id,
        razorpay_signature: requestData.razorpay_signature,
        verified_at: new Date().toISOString()
      }
    );

    if (!orderUpdateSuccess) {
      console.error('Failed to update order status');
      return new Response(
        JSON.stringify({ error: 'Failed to update order status' }),
        { headers: responseHeaders, status: 500 }
      );
    }

    // Get payment details
    const paymentData = await getPaymentDetails(supabase, requestData.payment_id);
    if (!paymentData) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch payment data' }),
        { headers: responseHeaders, status: 400 }
      );
    }

    // Validate user exists in custom_users table
    const userExists = await validateUser(supabase, paymentData.user_id);
    if (!userExists) {
      return new Response(
        JSON.stringify({ 
          error: 'User does not exist in custom_users table',
          message: 'Please contact support for assistance'
        }),
        { headers: responseHeaders, status: 400 }
      );
    }

    // Update payment status
    const paymentUpdateSuccess = await updatePaymentStatus(
      supabase,
      requestData.payment_id,
      requestData.razorpay_payment_id,
      requestData.razorpay_signature
    );

    if (!paymentUpdateSuccess) {
      return new Response(
        JSON.stringify({ error: 'Failed to update payment status' }),
        { headers: responseHeaders, status: 500 }
      );
    }

    // Update course enrollment
    const enrollmentSuccess = await updateCourseEnrollment(
      supabase,
      paymentData.course_id,
      paymentData.user_id
    );

    if (!enrollmentSuccess) {
      return new Response(
        JSON.stringify({ error: 'Failed to update course enrollment' }),
        { headers: responseHeaders, status: 500 }
      );
    }

    // Log user activity
    await logUserActivity(supabase, paymentData.user_id, paymentData.course_id);

    console.log('Payment verification and enrollment completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verification and enrollment completed successfully'
      }),
      { headers: responseHeaders, status: 200 }
    );
  } catch (error) {
    console.error('Error in payment verification:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Payment verification failed' }),
      { headers: responseHeaders, status: 400 }
    );
  }
});
