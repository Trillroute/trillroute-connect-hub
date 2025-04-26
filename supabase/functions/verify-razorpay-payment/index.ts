
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as crypto from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders, 
      status: 200 
    })
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      payment_id
    } = await req.json()

    console.log("Received verification request with data:", { razorpay_payment_id, razorpay_order_id, razorpay_signature, payment_id });

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !payment_id) {
      console.error("Missing required parameters:", { razorpay_payment_id, razorpay_order_id, razorpay_signature, payment_id });
      throw new Error('Missing required Razorpay verification parameters')
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
    
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not defined in environment variables");
      throw new Error('Razorpay secret key is not configured');
    }
    
    console.log("Verifying signature for body:", body);
    
    // Create HMAC signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureData = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );
    
    // Convert to hex
    const generated_signature = Array.from(new Uint8Array(signatureData))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log("Generated signature:", generated_signature);
    console.log("Received signature:", razorpay_signature);

    if (generated_signature !== razorpay_signature) {
      console.error("Signature verification failed");
      console.error("Expected:", generated_signature);
      console.error("Received:", razorpay_signature);
      throw new Error('Invalid payment signature')
    }

    console.log("Signature verified successfully");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get payment details to access course and user information
    const { data: paymentData, error: paymentFetchError } = await supabase
      .from('payments')
      .select('course_id, user_id')
      .eq('id', payment_id)
      .single()

    if (paymentFetchError || !paymentData) {
      console.error('Error fetching payment data:', paymentFetchError)
      throw new Error('Failed to fetch payment data')
    }

    console.log("Payment data fetched:", paymentData);

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment_id)

    if (updateError) {
      console.error('Error updating payment:', updateError)
      throw new Error('Failed to update payment status')
    }

    console.log("Payment status updated to completed");

    // Get current course data
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('student_ids, students')
      .eq('id', paymentData.course_id)
      .single()

    if (courseError) {
      console.error('Error fetching course:', courseError)
      throw new Error('Failed to fetch course data')
    }

    console.log("Course data fetched:", courseData);
    
    // Add student to course
    const currentStudentIds = courseData.student_ids || []
    const newStudentIds = [...currentStudentIds, paymentData.user_id]
    const newStudentCount = (courseData.students || 0) + 1

    console.log("Updating course with new student. Current IDs:", currentStudentIds);
    console.log("New student IDs:", newStudentIds);

    const { error: courseUpdateError } = await supabase
      .from('courses')
      .update({
        student_ids: newStudentIds,
        students: newStudentCount
      })
      .eq('id', paymentData.course_id)

    if (courseUpdateError) {
      console.error('Error updating course:', courseUpdateError)
      throw new Error('Failed to update course enrollment')
    }

    console.log('Payment verification and enrollment completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verification and enrollment completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in payment verification:', error)
    console.error('Error message:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Payment verification failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
