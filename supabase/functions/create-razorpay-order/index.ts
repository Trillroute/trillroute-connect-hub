
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RazorpayOrder {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, courseId, userId } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user exists in custom_users table instead of auth.users
    const { data: userData, error: userError } = await supabase
      .from('custom_users')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      console.error('Error finding user:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found in database' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        amount: amount,
        course_id: courseId,
        user_id: userId,
        status: 'pending',
        currency: 'INR'
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      throw new Error('Failed to create payment record')
    }

    // Create Razorpay order
    const orderData: RazorpayOrder = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
      currency: "INR",
      receipt: payment.id,
      notes: {
        courseId: courseId,
        userId: userId,
        paymentId: payment.id
      }
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(Deno.env.get('RAZORPAY_KEY_ID') + ':' + Deno.env.get('RAZORPAY_KEY_SECRET'))
      },
      body: JSON.stringify(orderData)
    })

    const razorpayOrder = await response.json()

    if (!razorpayOrder.id) {
      throw new Error('Failed to create Razorpay order')
    }

    // Update payment record with Razorpay order ID
    const { error: updateError } = await supabase
      .from('payments')
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Error updating payment record:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        orderId: razorpayOrder.id,
        amount: amount,
        paymentId: payment.id
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
