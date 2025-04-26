
import Razorpay from "npm:razorpay";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID') || '',
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') || '',
});

// Generate a shorter receipt ID (within 40 chars limit)
function generateShortReceiptId() {
  // Use timestamp + random chars to keep it unique but short
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `rcpt_${timestamp}${random}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'INR', user_id } = await req.json();

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

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit
      currency,
      receipt: generateShortReceiptId(), // Use shorter receipt ID
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    // Store payment record WITHOUT the user_id foreign key constraint
    // This avoids the error with the users table reference
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        // Use a custom field to store the user information instead of user_id
        // to avoid the foreign key constraint error
        metadata: { 
          user_id: user_id,
          order_details: order 
        },
        amount,
        currency,
        status: 'created',
        razorpay_order_id: order.id
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing payment:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        order_id: order.id,
        payment_id: payment.id,
        key_id: Deno.env.get('RAZORPAY_KEY_ID')
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
