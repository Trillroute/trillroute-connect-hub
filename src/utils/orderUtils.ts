
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
