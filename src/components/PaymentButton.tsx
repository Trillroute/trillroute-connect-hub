
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

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, courseId, userId: user.id }
      });

      if (orderError || !orderData) {
        console.error('Error creating order:', orderError);
        toast.error("Payment Failed", {
          description: "Failed to create payment order"
        });
        if (onError) onError(orderError);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: "lhsnzdonofweltzjpguf_key", // Replace with your Razorpay key ID
        amount: amount * 100,
        currency: "INR",
        name: "Your Course Platform",
        description: "Course Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: { 
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                payment_id: orderData.paymentId
              }
            });

            if (verificationError) {
              console.error('Payment verification failed:', verificationError);
              toast.error("Payment Verification Failed", {
                description: "Please contact support"
              });
              if (onError) onError(verificationError);
              return;
            }

            // Store payment intent in session storage
            sessionStorage.setItem('paymentIntent', JSON.stringify({
              courseId,
              userId: user.id,
              payment_id: orderData.paymentId,
              timestamp: new Date().getTime()
            }));

            // Call success callback
            if (onSuccess) onSuccess(response);

            // Redirect with success parameter
            navigate(`/courses/${courseId}?enrollment=success`);

          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error("Payment Processing Failed", {
              description: "Please try again or contact support"
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
