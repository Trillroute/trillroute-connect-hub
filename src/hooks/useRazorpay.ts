
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentOptions {
  amount: number;
  currency?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const initializePayment = async ({ amount, currency = 'INR', onSuccess, onError }: PaymentOptions) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to make a payment",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create order using our edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay', {
        body: { amount, currency, user_id: user.id },
      });

      if (orderError) throw orderError;

      const options = {
        key: orderData.key_id,
        amount: amount * 100,
        currency,
        name: "Trillroute",
        description: "Course Payment",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Update payment status
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'completed',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              metadata: { ...response }
            })
            .eq('razorpay_order_id', orderData.order_id);

          if (updateError) {
            console.error('Error updating payment:', updateError);
            toast({
              title: "Payment Update Failed",
              description: "Your payment was successful but we couldn't update our records. Please contact support.",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
          });

          if (onSuccess) onSuccess(response);
        },
        prefill: {
          email: user.email,
          contact: user.primaryPhone,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment, loading };
};
