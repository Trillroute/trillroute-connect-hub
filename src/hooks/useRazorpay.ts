
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
      
      if (onError) onError({ message: "Authentication required" });
      return;
    }

    try {
      setLoading(true);
      
      if (amount <= 0) {
        throw new Error("Payment amount must be greater than 0");
      }

      // Create order using our edge function
      console.log('Initializing payment with user ID:', user.id);
      const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay', {
        body: { amount, currency, user_id: user.id },
      });

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }
      
      if (!orderData) {
        console.error('No order data returned');
        throw new Error("No data returned from payment function");
      }

      console.log('Order data received:', orderData);

      const options = {
        key: orderData.key_id,
        amount: amount * 100,
        currency,
        name: "Trillroute",
        description: "Course Payment",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          console.log('Payment success, response:', response);
          
          // Update payment status
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'completed',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              metadata: { 
                ...response,
                user_id: user.id // Store user_id in metadata
              }
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
        modal: {
          ondismiss: function() {
            setLoading(false);
            if (onError) onError({ message: "Payment canceled by user" });
          }
        }
      };

      // Check if Razorpay is loaded
      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page and try again.");
      }

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
