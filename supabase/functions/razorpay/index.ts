
import Razorpay from "npm:razorpay";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID') || '',
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') || '',
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let payload;
    try {
      payload = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request payload' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    const { amount, currency = 'INR', user_id, course_id } = payload;
    
    console.log('Payment request received:', { amount, currency, user_id, course_id });

    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Amount must be greater than 0.' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    if (!user_id) {
      console.error('Missing user_id parameter');
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    if (!course_id) {
      console.error('Missing course_id parameter');
      return new Response(
        JSON.stringify({ error: 'Course ID is required' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Verify user exists in custom_users table instead of profiles
    const { data: userData, error: userError } = await supabase
      .from('custom_users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError) {
      console.error('Error verifying user:', userError);
      
      // Continue anyway - don't block payment if user verification fails
      console.log('Proceeding with payment despite user verification failure');
    }

    // Verify course exists
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', course_id)
      .single();

    if (courseError) {
      console.error('Error verifying course:', courseError);
      return new Response(
        JSON.stringify({ error: 'Invalid course ID or course not found' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Create initial payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id,
        course_id,
        amount,
        currency,
        status: 'pending',
        metadata: {
          timestamp: new Date().toISOString(),
          amount_in_smallest_unit: Math.round(amount * 100)
        }
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      throw new Error('Failed to create payment record');
    }

    console.log('Payment record created:', paymentRecord);

    // Create a payment link
    const paymentLinkOptions = {
      amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
      currency,
      accept_partial: false,
      description: `Course Enrollment: ${courseData?.title || 'Course Enrollment Payment'}`,
      customer: {
        name: 'Course Student',
        email: 'student@example.com',
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        user_id,
        course_id,
        payment_id: paymentRecord.id
      },
      callback_url: `${req.headers.get('origin')}/courses/${course_id}?enrollment=success&userId=${user_id}&courseId=${course_id}`,
      callback_method: 'get'
    };

    console.log('Creating Razorpay payment link with options:', paymentLinkOptions);
    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
    console.log('Razorpay payment link created:', paymentLink);

    // Update payment record with Razorpay order details
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_order_id: paymentLink.order_id,
        metadata: {
          ...paymentRecord.metadata,
          razorpay_payment_link: paymentLink
        }
      })
      .eq('id', paymentRecord.id);

    if (updateError) {
      console.error('Error updating payment record:', updateError);
      // Don't throw here, we still want to return the payment link
    }

    return new Response(
      JSON.stringify({ 
        payment_link: paymentLink.short_url,
        payment_id: paymentRecord.id
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in razorpay function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
