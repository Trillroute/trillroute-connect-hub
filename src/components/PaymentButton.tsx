
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PaymentButtonProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
  courseId: string;
  amount: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentButton = ({
  onSuccess,
  onError,
  className,
  children = 'Pay Now',
  courseId,
  amount
}: PaymentButtonProps) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        toast.error("Authentication Required", {
          description: "Please login to enroll in this course"
        });
        
        localStorage.setItem('enrollRedirectUrl', `/courses/${courseId}`);
        navigate('/auth/login');
        return;
      }

      if (!window.Razorpay) {
        toast.error("Payment Gateway", {
          description: "Payment gateway is still loading. Please try again in a moment."
        });
        return;
      }

      // Save payment intent to session storage to help with redirect handling
      const paymentIntent = {
        courseId,
        userId: user.id,
        timestamp: new Date().getTime(),
        completed: false  // Will be set to true after successful payment
      };
      sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
      console.log('Payment intent created:', paymentIntent);

      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, courseId, userId: user.id }
      });

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error("Payment Failed", {
          description: "Failed to create payment. Please try again."
        });
        if (onError) onError(orderError);
        setLoading(false);
        return;
      }

      if (!orderData || !orderData.orderId || !orderData.key) {
        console.error('Invalid order data received:', orderData);
        toast.error("Payment Failed", {
          description: "Invalid payment configuration received. Please try again."
        });
        setLoading(false);
        return;
      }

      // Store payment ID in the paymentIntent for verification after redirection
      if (orderData.paymentId) {
        const updatedIntent = {
          ...paymentIntent,
          payment_id: orderData.paymentId,
        };
        sessionStorage.setItem('paymentIntent', JSON.stringify(updatedIntent));
      }

      const options = {
        key: orderData.key,
        amount: amount * 100,
        currency: "INR",
        name: "Music Course Platform",
        description: "Course Payment",
        order_id: orderData.orderId,
        handler: function (response: any) {
          try {
            console.log('Payment successful:', response);
            
            // Update the payment intent with the response data and mark as completed
            const currentIntent = JSON.parse(sessionStorage.getItem('paymentIntent') || '{}');
            const updatedIntent = {
              ...currentIntent,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              completed: true
            };
            console.log('Updating payment intent with completion data:', updatedIntent);
            sessionStorage.setItem('paymentIntent', JSON.stringify(updatedIntent));

            // Verify payment on server before redirecting
            supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                payment_id: orderData.paymentId
              }
            }).then(({data, error}) => {
              if (error) {
                console.error('Payment verification error:', error);
                toast.error('Payment Verification Failed', {
                  description: 'Please contact support if payment was deducted'
                });
                return;
              }
              
              console.log('Payment verified:', data);
              
              if (data && data.redirectUrl) {
                console.log('Redirecting to', data.redirectUrl);
                // Force redirect to the course page with success parameter
                window.location.href = data.redirectUrl;
              } else {
                // Fallback redirect
                console.log('Fallback redirect to', `/courses/${courseId}?enrollment=success`);
                window.location.href = `/courses/${courseId}?enrollment=success`;
              }
            });
            
            if (onSuccess) onSuccess(response);
          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error("Payment Processing Failed", {
              description: "Please contact support if your payment was deducted"
            });
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        },
        theme: {
          color: "#9b87f5"
        },
        // Add a modal close event handler to manage cases where user closes the payment window
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.info("Payment Cancelled", {
              description: "You can try again when you're ready"
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment Failed", {
        description: error.message || "Failed to process payment"
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
};
