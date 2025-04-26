
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
    
    console.log('Razorpay order details:', data);
    return data;
  } catch (error) {
    console.error('Exception fetching Razorpay order details:', error);
    throw new Error('Failed to fetch Razorpay order details');
  }
};
