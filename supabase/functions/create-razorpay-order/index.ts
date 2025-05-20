
import { serve } from "https://deno.land/std@0.188.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

interface RazorpayOrder {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

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

serve(async (req) => {
  console.log("Received request to create-razorpay-order");

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
    const { amount, courseId, userId } = await req.json();

    if (!amount || !courseId || !userId) {
      console.error('Missing required parameters:', { amount, courseId, userId });
      throw new Error('Missing required parameters: amount, courseId, or userId');
    }

    console.log(`Creating order for user ${userId}, course ${courseId}, amount ${amount}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user exists in custom_users table
    const userExists = await validateUser(supabase, userId);
    if (!userExists) {
      console.error('User does not exist in custom_users table:', userId);
      return new Response(
        JSON.stringify({ 
          error: 'User does not exist in system',
          message: 'Please contact support for assistance' 
        }),
        { headers: responseHeaders, status: 400 }
      );
    }

    // Create a unique order ID for internal tracking
    const orderId = crypto.randomUUID();

    // Create Razorpay order
    const orderData: RazorpayOrder = {
      amount: amount * 100,
      currency: "INR",
      receipt: orderId,
      notes: {
        courseId: courseId,
        userId: userId,
        orderId: orderId
      }
    };

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay API keys not found');
      return new Response(
        JSON.stringify({ 
          error: 'Razorpay API keys not configured',
          message: 'Please check environment variables' 
        }),
        { headers: responseHeaders, status: 500 }
      );
    }

    console.log('Sending request to Razorpay API');
    console.log('Using API Key ID:', razorpayKeyId.substring(0, 5) + '...');
    
    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(razorpayKeyId + ':' + razorpayKeySecret)
        },
        body: JSON.stringify(orderData)
      });

      // Log response status
      console.log('Razorpay API response status:', response.status);
      
      const razorpayOrder = await response.json();
      console.log('Razorpay API response body:', razorpayOrder);

      if (!razorpayOrder.id) {
        console.error('Razorpay API error:', razorpayOrder);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create Razorpay order',
            message: razorpayOrder.error?.description || 'API authentication failed'
          }),
          { headers: responseHeaders, status: 400 }
        );
      }

      console.log('Razorpay order created:', razorpayOrder.id);

      try {
        // Create order record in Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            id: orderId,
            order_id: razorpayOrder.id,
            user_id: userId,
            course_id: courseId,
            amount: amount,
            metadata: {
              razorpay_order_data: razorpayOrder
            }
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating order record:', orderError);
          throw new Error('Failed to create order record');
        }

        console.log('Order record created:', order);
      } catch (orderError) {
        console.error('Exception during order record creation:', orderError);
        throw new Error('Failed to create order record');
      }

      return new Response(
        JSON.stringify({ 
          orderId: razorpayOrder.id,
          amount: amount,
          key: razorpayKeyId
        }),
        {
          headers: responseHeaders,
          status: 200,
        }
      );
    } catch (fetchError) {
      console.error('Fetch error with Razorpay API:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to connect to Razorpay API',
          message: 'Check your network connection and API keys' 
        }),
        { headers: responseHeaders, status: 500 }
      );
    }
  } catch (error) {
    console.error('Error during order creation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create order',
        message: 'Please check Razorpay configuration' 
      }),
      {
        headers: responseHeaders,
        status: 400,
      }
    );
  }
});
