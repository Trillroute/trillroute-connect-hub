
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
  const { user, isAuthenticated, refreshSession } = useAuth();

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

      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, courseId, userId: user.id }
      });

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error("Payment Failed", {
          description: "Failed to create payment. Please try again."
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

      const options = {
        key: orderData.key,
        amount: amount * 100,
        currency: "INR",
        name: "Music Course Platform",
        description: "Course Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            console.log('Payment successful:', response);
            toast.success('Payment Successful', {
              description: 'You have been enrolled in the course'
            });

            if (onSuccess) onSuccess(response);
            navigate(`/courses/${courseId}?enrollment=success`);
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
