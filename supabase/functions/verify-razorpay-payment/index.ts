
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      payment_id 
    } = await req.json()

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = createHmac("sha256", Deno.env.get('RAZORPAY_KEY_SECRET') ?? '')
      .update(body)
      .toString("hex")

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update payment record
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

    return new Response(
      JSON.stringify({ success: true }),
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
