
import { useState, useEffect } from 'react';
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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadRazorpayScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        toast({
          title: "Payment System Error",
          description: "Failed to load payment system. Please try again later.",
          variant: "destructive",
        });
      };
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, [toast]);

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
      
      // Handle free courses (amount <= 0)
      if (amount <= 0) {
        console.log("Free enrollment, bypassing payment");
        if (onSuccess) {
          onSuccess({ free_enrollment: true });
        }
        return;
      }

      // Check if Razorpay script is loaded
      if (!scriptLoaded) {
        console.error('Razorpay script not loaded yet');
        toast({
          title: "Payment System Loading",
          description: "Payment system is still loading. Please try again in a moment.",
          variant: "destructive",
        });
        if (onError) onError({ message: "Payment system not ready yet" });
        return;
      }

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

      // Check again if Razorpay is available
      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page and try again.");
      }

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

  return { initializePayment, loading, scriptLoaded };
};
