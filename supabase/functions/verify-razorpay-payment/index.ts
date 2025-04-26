
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

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !payment_id) {
      throw new Error('Missing required Razorpay verification parameters')
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
    
    // Create HMAC signature
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(body)
    );
    
    // Convert to hex
    const generated_signature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (generated_signature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

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

    // Add student to course
    const currentStudentIds = courseData.student_ids || []
    const newStudentIds = [...currentStudentIds, paymentData.user_id]
    const newStudentCount = (courseData.students || 0) + 1

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
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
