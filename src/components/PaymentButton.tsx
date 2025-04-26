import React from 'react';
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

  React.useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const checkExistingOrder = async (orderId: string) => {
    try {
      const orderData = await getOrderStatus(orderId);
      if (orderData.status === 'completed') {
        toast.success('Payment Already Completed', {
          description: 'This order has already been processed successfully.'
        });
        if (onSuccess) onSuccess({ orderId });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking order status:', error);
      return false;
    }
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login...');
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

      console.log('Creating Razorpay order for course:', courseId);
      console.log('User ID:', user.id);

      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, courseId, userId: user.id }
      });

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error("Payment Failed", {
          description: "Failed to create payment order. Please try again."
        });
        if (onError) onError(orderError);
        return;
      }

      if (!orderData || !orderData.orderId || !orderData.key) {
        console.error('Invalid order data received:', orderData);
        toast.error("Payment Failed", {
          description: "Invalid payment configuration received. Please try again."
        });
        return;
      }

      if (await checkExistingOrder(orderData.orderId)) {
        setLoading(false);
        return;
      }

      console.log('Order created successfully:', orderData);
      
      // Store payment intent in session storage for later verification
      const paymentIntent = {
        courseId,
        userId: user.id,
        payment_id: orderData.paymentId,
        timestamp: new Date().getTime()
      };
      
      sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
      console.log('Payment intent stored in session storage:', paymentIntent);

      const options = {
        key: orderData.key,
        amount: amount * 100,
        currency: "INR",
        name: "Music Course Platform",
        description: "Course Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            console.log('Payment successful, verifying payment...');
            console.log('Payment response:', response);
            
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              payment_id: orderData.paymentId
            };
            
            console.log('Sending verification data:', verificationData);
            
            try {
              const { data: verificationResult, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: verificationData
              });

              if (verificationError) {
                console.error('Payment verification failed:', verificationError);
                
                // Manual enrollment as a fallback
                toast.error("Payment Verification Issue", {
                  description: "Your payment was successful but we encountered an issue during verification. We'll process your enrollment manually."
                });
                
                // Store verification data for manual processing
                localStorage.setItem('manualVerification', JSON.stringify({
                  ...verificationData,
                  courseId,
                  userId: user.id,
                  timestamp: new Date().toISOString()
                }));
                
                if (onError) onError(verificationError);
                navigate(`/courses/${courseId}?payment=successful&verification=manual`);
                return;
              }

              console.log('Payment verified successfully:', verificationResult);
              toast.success('Payment Successful', {
                description: 'You have been enrolled in the course'
              });

              if (onSuccess) onSuccess(response);

              navigate(`/courses/${courseId}?enrollment=success`);
            } catch (verifyError) {
              console.error('Exception during payment verification:', verifyError);
              
              // Manual enrollment as a fallback
              toast.error("Payment Verification Exception", {
                description: "Your payment was successful but we encountered an exception during verification. We'll process your enrollment manually."
              });
              
              // Store verification data for manual processing
              localStorage.setItem('manualVerification', JSON.stringify({
                ...verificationData,
                courseId,
                userId: user.id,
                timestamp: new Date().toISOString()
              }));
              
              if (onError) onError(verifyError);
              navigate(`/courses/${courseId}?payment=successful&verification=failed`);
            }
          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error("Payment Processing Failed", {
              description: "Please contact support if your payment was deducted"
            });
            if (onError) onError(error);
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        },
        theme: {
          color: "#9b87f5"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            console.log('Payment modal dismissed');
          }
        }
      };

      console.log('Opening Razorpay payment modal...');
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
