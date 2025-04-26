
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'INR', user_id, course_id } = await req.json();

    // Validate amount
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

    // Create a payment link
    const paymentLinkOptions = {
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency,
      accept_partial: false,
      description: `Course Enrollment Payment`,
      customer: {
        name: 'Course Student', // This will be filled by Razorpay's form
        email: 'student@example.com', // This will be filled by Razorpay's form
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        user_id: user_id,
        course_id: course_id
      },
      callback_url: `${req.headers.get('origin')}/courses/${course_id}?enrollment=success`,
      callback_method: 'get'
    };

    console.log('Creating Razorpay payment link with options:', paymentLinkOptions);
    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
    console.log('Razorpay payment link created:', paymentLink);

    // Store the payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        metadata: { 
          user_id: user_id,
          course_id: course_id,
          payment_link_id: paymentLink.id
        },
        amount,
        currency,
        status: 'pending',
        user_id: null // Keep as null since we're using metadata
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing payment:', error);
      throw error;
    }

    console.log('Payment record created:', payment);

    return new Response(
      JSON.stringify({ 
        payment_link: paymentLink.short_url,
        payment_id: payment.id
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
