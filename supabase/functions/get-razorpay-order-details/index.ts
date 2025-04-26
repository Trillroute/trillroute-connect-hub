
import { serve } from "https://deno.land/std@0.188.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  console.log("Received request to get-razorpay-order-details");

  // Handle OPTIONS preflight request
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
    const { orderId } = await req.json();

    if (!orderId) {
      console.error('Missing required parameter: orderId');
      throw new Error('Missing required parameter: orderId');
    }

    console.log(`Fetching details for Razorpay order: ${orderId}`);

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay API keys not found');
      return new Response(
        JSON.stringify({ error: 'Razorpay API keys not configured' }),
        { headers: responseHeaders, status: 500 }
      );
    }

    // Fetch order details from Razorpay API
    const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(razorpayKeyId + ':' + razorpayKeySecret)
      }
    });

    const razorpayOrderDetails = await response.json();

    if (razorpayOrderDetails.error) {
      console.error('Razorpay API error:', razorpayOrderDetails);
      throw new Error(`Failed to fetch Razorpay order details: ${JSON.stringify(razorpayOrderDetails.error)}`);
    }

    console.log('Razorpay order details fetched:', razorpayOrderDetails);

    return new Response(
      JSON.stringify({
        success: true,
        order: razorpayOrderDetails
      }),
      {
        headers: responseHeaders,
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error during order details fetch:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch order details' }),
      {
        headers: responseHeaders,
        status: 400,
      }
    );
  }
});
