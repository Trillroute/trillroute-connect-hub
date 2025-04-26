
import Razorpay from "npm:razorpay";
import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID') || '',
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') || '',
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'INR', user_id } = await req.json();

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit
      currency,
      receipt: `receipt_${crypto.randomUUID()}`,
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    // Store initial payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id,
        amount,
        currency,
        status: 'created',
        razorpay_order_id: order.id,
        metadata: { order_details: order }
      })
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
