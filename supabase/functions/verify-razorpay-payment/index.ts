
import { serve } from "https://deno.land/std@0.188.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0'
import * as crypto from "https://deno.land/std@0.188.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.188.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  console.log("Received request to verify-razorpay-payment");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: corsHeaders, 
      status: 204 
    });
  }

  // Add CORS headers to all responses
  const responseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json'
  };

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      payment_id
    } = await req.json();

    console.log("Received verification request with data:", { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      payment_id 
    });

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !payment_id) {
      console.error("Missing required parameters:", { 
        razorpay_payment_id, 
        razorpay_order_id, 
        razorpay_signature, 
        payment_id 
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Missing required Razorpay verification parameters' 
        }),
        {
          headers: responseHeaders,
          status: 400,
        }
      );
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
    
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not defined in environment variables");
      return new Response(
        JSON.stringify({ error: 'Razorpay secret key is not configured' }),
        {
          headers: responseHeaders,
          status: 500,
        }
      );
    }
    
    console.log("Verifying signature for body:", body);
    
    try {
      // Create HMAC signature using the updated Deno crypto API
      const keyData = new TextEncoder().encode(secret);
      const message = new TextEncoder().encode(body);
      
      // Create HMAC using sha256
      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        message
      );
      
      // Use the correct hex encoding function from Deno std
      const generatedSignature = hexEncode(new Uint8Array(signature));
      
      console.log("Generated signature:", generatedSignature);
      console.log("Received signature:", razorpay_signature);

      if (generatedSignature !== razorpay_signature) {
        console.error("Signature verification failed");
        console.error("Generated:", generatedSignature);
        console.error("Received:", razorpay_signature);
        
        return new Response(
          JSON.stringify({ error: 'Invalid payment signature' }),
          {
            headers: responseHeaders,
            status: 400,
          }
        );
      }

      console.log("Signature verified successfully");
    } catch (signError) {
      console.error("Error during signature verification:", signError);
      
      return new Response(
        JSON.stringify({ error: `Signature verification error: ${signError.message}` }),
        {
          headers: responseHeaders,
          status: 400,
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials missing");
      return new Response(
        JSON.stringify({ error: 'Database credentials are not configured' }),
        {
          headers: responseHeaders,
          status: 500,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get payment details to access course and user information
    const { data: paymentData, error: paymentFetchError } = await supabase
      .from('payments')
      .select('course_id, user_id')
      .eq('id', payment_id)
      .single();

    if (paymentFetchError || !paymentData) {
      console.error('Error fetching payment data:', paymentFetchError);
      
      return new Response(
        JSON.stringify({ error: 'Failed to fetch payment data' }),
        {
          headers: responseHeaders,
          status: 400,
        }
      );
    }

    console.log("Payment data fetched:", paymentData);

    // Verify user exists in custom_users table
    const { data: userData, error: userError } = await supabase
      .from('custom_users')
      .select('id')
      .eq('id', paymentData.user_id)
      .single();

    if (userError || !userData) {
      console.error('User not found in custom_users table:', userError);
      
      // Don't fail the verification process, but log the warning
      console.warn(`User with ID ${paymentData.user_id} not found in custom_users table, proceeding anyway`);
    } else {
      console.log('User verified in custom_users table:', userData.id);
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment_id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      
      return new Response(
        JSON.stringify({ error: `Failed to update payment status: ${updateError.message}` }),
        {
          headers: responseHeaders,
          status: 500,
        }
      );
    }

    console.log("Payment status updated to completed");

    // Get current course data
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', paymentData.course_id)
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      
      return new Response(
        JSON.stringify({ error: `Failed to fetch course data: ${courseError.message}` }),
        {
          headers: responseHeaders,
          status: 500,
        }
      );
    }

    console.log("Course data fetched:", courseData);
    
    // Add student to course
    const currentStudentIds = courseData.student_ids || [];
    
    // Check if student is already enrolled
    if (currentStudentIds.includes(paymentData.user_id)) {
      console.log("Student already enrolled in course, skipping enrollment update");
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Payment verified successfully, student already enrolled'
        }),
        {
          headers: responseHeaders,
          status: 200,
        }
      );
    }
    
    const newStudentIds = [...currentStudentIds, paymentData.user_id];
    const newStudentCount = (courseData.students || 0) + 1;

    console.log("Updating course with new student. Current IDs:", currentStudentIds);
    console.log("New student IDs:", newStudentIds);

    const { error: courseUpdateError } = await supabase
      .from('courses')
      .update({
        student_ids: newStudentIds,
        students: newStudentCount
      })
      .eq('id', paymentData.course_id);

    if (courseUpdateError) {
      console.error('Error updating course:', courseUpdateError);
      
      return new Response(
        JSON.stringify({ error: `Failed to update course enrollment: ${courseUpdateError.message}` }),
        {
          headers: responseHeaders,
          status: 500,
        }
      );
    }

    console.log('Payment verification and enrollment completed successfully');

    // Add entry to user activity logs
    try {
      const { error: logError } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: paymentData.user_id,
          action: 'payment_completed',
          component: 'course_enrollment',
          entity_id: paymentData.course_id,
          page_url: '/courses/' + paymentData.course_id
        });

      if (logError) {
        console.error('Error logging user activity:', logError);
        // Don't fail the whole operation if logging fails
      }
    } catch (logError) {
      console.error('Error during activity logging:', logError);
      // Don't fail the whole operation if logging fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verification and enrollment completed successfully'
      }),
      {
        headers: responseHeaders,
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in payment verification:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Payment verification failed' }),
      {
        headers: responseHeaders,
        status: 400,
      }
    );
  }
});
