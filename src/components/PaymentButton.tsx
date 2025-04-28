
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

  // Clear any stale payment intents on component mount
  useEffect(() => {
    const clearStalePaymentIntents = () => {
      const paymentIntentString = sessionStorage.getItem('paymentIntent');
      if (paymentIntentString) {
        try {
          const paymentIntent = JSON.parse(paymentIntentString);
          // Check if this is for a different course or old
          if (paymentIntent.courseId !== courseId || 
              paymentIntent.timestamp < (Date.now() - 3600000)) { // 1 hour old
            console.log('Clearing stale payment intent', paymentIntent);
            sessionStorage.removeItem('paymentIntent');
          }
        } catch (e) {
          console.error('Error parsing payment intent:', e);
          sessionStorage.removeItem('paymentIntent');
        }
      }
    };
    
    clearStalePaymentIntents();
  }, [courseId]);

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
        completed: false,  // Will be set to true after successful payment
        initiation_time: new Date().toISOString()
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

      // Update payment intent with order information
      const updatedIntent = {
        ...paymentIntent,
        razorpay_order_id: orderData.orderId,
        payment_id: orderData.paymentId,
      };
      sessionStorage.setItem('paymentIntent', JSON.stringify(updatedIntent));
      console.log('Payment intent updated with order ID:', updatedIntent);

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
              completed: true,
              completed_time: new Date().toISOString()
            };
            console.log('Updating payment intent with completion data:', updatedIntent);
            sessionStorage.setItem('paymentIntent', JSON.stringify(updatedIntent));

            // Show success toast immediately to give user feedback
            toast.success('Payment Successful', {
              description: 'Processing your enrollment...'
            });

            // Verify payment on server before redirecting
            supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                payment_id: orderData.paymentId || 'unknown'
              }
            }).then(({data, error}) => {
              if (error) {
                console.error('Payment verification error:', error);
                toast.error('Payment Verification Failed', {
                  description: 'Please contact support if payment was deducted'
                });
                return;
              }
              
              console.log('Payment verified by backend:', data);
              
              // Force redirect to the course page with success parameter
              console.log('Redirecting to', `/courses/${courseId}?enrollment=success`);
              window.location.href = `/courses/${courseId}?enrollment=success`;
              
              if (onSuccess) onSuccess(response);
            });
          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error("Payment Processing Failed", {
              description: "Please contact support if your payment was deducted"
            });
          }
        },
        prefill: {
          name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email,
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
