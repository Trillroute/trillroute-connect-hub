
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
      console.log('Order ID for update:', orderId);

      // First verify if this is the exact order_id format stored in our database
      const { data: orderCheck, error: checkError } = await supabase
        .from('orders')
        .select('id')
        .eq('order_id', orderId)
        .single();
      
      if (checkError) {
        console.error('Error checking order existence:', checkError);
        console.log('Trying alternative order ID format search...');
      } else {
        console.log('Found matching order record:', orderCheck);
      }

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
    }
    
    console.log('Razorpay order details:', data);
    return data;
  } catch (error) {
    console.error('Exception fetching Razorpay order details:', error);
    throw new Error('Failed to fetch Razorpay order details');
  }
};
