
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

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

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadRazorpayScript = () => {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        console.log('Razorpay script already exists in DOM');
        setScriptLoaded(true);
        return;
      }

      console.log('Attempting to load Razorpay script');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        toast.error("Payment System Error", {
          description: "Failed to load payment system. Please try again later."
        });
      };
      document.body.appendChild(script);
    };

    loadRazorpayScript();
    
    // Cleanup function to handle component unmounting
    return () => {
      // We don't remove the script as other components might need it
      // But we can clean up any other resources if needed
    };
  }, []);

  // Check if Razorpay is available globally
  const isRazorpayAvailable = useCallback(() => {
    return typeof window !== 'undefined' && !!(window as any).Razorpay;
  }, []);

  const initializePayment = async ({ amount, currency = 'INR', onSuccess, onError }: PaymentOptions) => {
    // Return early if already loading
    if (loading) {
      console.log('Payment process already in progress');
      return;
    }

    if (!user) {
      toast.error("Authentication Required", {
        description: "Please login to make a payment"
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
        setLoading(false);
        return;
      }

      // Ensure Razorpay is available after script loading
      if (!scriptLoaded) {
        console.log('Waiting for Razorpay script to load...');
        toast("Payment System Loading", {
          description: "Payment system is still loading. Please wait a moment."
        });
        
        // Wait a moment and check again - give script a chance to load
        setTimeout(() => {
          if (isRazorpayAvailable()) {
            console.log('Razorpay became available after delay');
            setScriptLoaded(true);
            // Retry the payment initialization
            setLoading(false);
          } else {
            console.error('Razorpay still not available after delay');
            toast.error("Payment System Error", {
              description: "Payment system failed to load. Please refresh the page and try again."
            });
            if (onError) onError({ message: "Payment system not ready" });
            setLoading(false);
          }
        }, 2000);
        
        return;
      }
      
      // Double check Razorpay is available
      if (!isRazorpayAvailable()) {
        console.error('Razorpay not available despite script being loaded');
        throw new Error("Payment system not properly initialized. Please refresh the page.");
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
            toast.error("Payment Update Failed", {
              description: "Your payment was successful but we couldn't update our records. Please contact support."
            });
            return;
          }

          toast.success("Payment Successful", {
            description: "Your payment has been processed successfully."
          });

          if (onSuccess) onSuccess(response);
        },
        prefill: {
          email: user.email,
          contact: user.primaryPhone || '',
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

      console.log('Creating Razorpay instance with options:', options);
      const RazorpayConstructor = (window as any).Razorpay;
      const razorpayInstance = new RazorpayConstructor(options);
      console.log('Opening Razorpay payment modal');
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error("Payment Failed", {
        description: error.message || "Failed to initialize payment"
      });
      if (onError) onError(error);
      setLoading(false);
    }
  };

  return { 
    initializePayment, 
    loading, 
    scriptLoaded: scriptLoaded && isRazorpayAvailable() 
  };
};
