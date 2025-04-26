
import { supabase } from "@/integrations/supabase/client";

export const getOrderStatus = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('status, amount, metadata')
    .eq('order_id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order status');
  }

  console.log('Order data:', data);
  return data;
};

export const getRazorpayOrderDetails = async (orderId: string) => {
  try {
    console.log('Fetching detailed Razorpay order status for:', orderId);
    
    const { data, error } = await supabase.functions.invoke('get-razorpay-order-details', {
      body: { orderId }
    });
    
    if (error) {
      console.error('Error fetching Razorpay order details:', error);
      throw new Error('Failed to fetch Razorpay order details');
    }

    // Update order status in Supabase if Razorpay data is available
    if (data?.order) {
      const razorpayStatus = data.order.status;
      const metadata = {
        razorpay_status: razorpayStatus,
        last_checked: new Date().toISOString(),
        ...data.order
      };

      console.log('Updating Supabase with Razorpay status:', razorpayStatus);
      
      // First verify and get order details from our database
      const { data: orderCheck, error: checkError } = await supabase
        .from('orders')
        .select('id, user_id, course_id')
        .eq('order_id', orderId)
        .single();
      
      if (checkError) {
        console.error('Error checking order existence:', checkError);
        return data;
      }

      console.log('Found matching order record:', orderCheck);

      // Update the order record with the latest status from Razorpay
      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: razorpayStatus === 'paid' ? 'completed' : razorpayStatus,
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)
        .select();

      if (updateError) {
        console.error('Error updating order status:', updateError);
      } else {
        console.log('Successfully updated order status in Supabase:', updateData);
      }

      // Update or create payment record
      if (orderCheck && orderCheck.user_id && orderCheck.course_id) {
        const paymentData = {
          amount: data.order.amount / 100, // Convert from paisa to INR
          user_id: orderCheck.user_id,
          course_id: orderCheck.course_id,
          status: razorpayStatus === 'paid' ? 'completed' : razorpayStatus,
          razorpay_order_id: orderId,
          metadata: data.order,
          updated_at: new Date().toISOString()
        };

        const { error: paymentError } = await supabase
          .from('payments')
          .upsert(
            paymentData,
            {
              onConflict: 'razorpay_order_id',
              ignoreDuplicates: false
            }
          );

        if (paymentError) {
          console.error('Error updating payment record:', paymentError);
        } else {
          console.log('Successfully updated payment record');
        }
      } else {
        console.error('Missing user_id or course_id in order record, cannot update payment table');
      }
    }
    
    console.log('Razorpay order details:', data);
    return data;
  } catch (error) {
    console.error('Exception fetching Razorpay order details:', error);
    throw new Error('Failed to fetch Razorpay order details');
  }
};
