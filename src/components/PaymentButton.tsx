
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
  courseId: string;
}

export const PaymentButton = ({
  amount,
  currency = 'INR',
  onSuccess,
  onError,
  className,
  children = 'Pay Now',
  courseId
}: PaymentButtonProps) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleClick = async () => {
    if (!amount || amount <= 0) {
      toast.error("Invalid Amount", {
        description: "Cannot process payment for zero or negative amount"
      });
      return;
    }

    try {
      setLoading(true);
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login...');
        toast.error("Authentication Required", {
          description: "Please login to make a payment"
        });
        
        localStorage.setItem('paymentRedirectUrl', `/courses/${courseId}`);
        localStorage.setItem('paymentIntent', JSON.stringify({
          courseId,
          amount,
          currency,
          timestamp: new Date().getTime()
        }));
        
        navigate('/auth/login');
        return;
      }

      // Double check course ID is valid
      if (!courseId) {
        console.error('Missing course ID');
        toast.error("Configuration Error", {
          description: "Missing course information. Please try again later."
        });
        if (onError) onError({ message: "Missing course ID" });
        return;
      }

      console.log('Creating payment link for user:', user.id, 'course:', courseId);

      toast.info("Connecting to payment gateway", {
        description: "Please wait while we connect to the payment service..."
      });

      // Log full payment parameters
      console.log('Payment parameters:', {
        amount,
        currency,
        user_id: user.id,
        course_id: courseId
      });

      // Include a retry mechanism
      let attempts = 0;
      const maxAttempts = 2;
      let success = false;
      let responseData = null;
      let responseError = null;
      
      while (attempts < maxAttempts && !success) {
        attempts++;
        console.log(`Payment attempt ${attempts}/${maxAttempts}`);
        
        try {
          const { data, error } = await supabase.functions.invoke('razorpay', {
            body: { 
              amount,
              currency,
              user_id: user.id,
              course_id: courseId
            },
          });
          
          if (error) {
            console.error(`Razorpay function error (attempt ${attempts}):`, error);
            responseError = error;
            // Continue to retry
          } else if (data) {
            console.log(`Successful response on attempt ${attempts}:`, data);
            responseData = data;
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error on attempt ${attempts}:`, err);
          responseError = err;
        }
        
        // Wait before retry
        if (!success && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!success) {
        // All attempts failed
        console.error('All payment initialization attempts failed:', responseError);
        toast.error("Payment Gateway Error", {
          description: responseError?.message || "Failed to connect to payment gateway. Please try again."
        });
        if (onError) onError(responseError);
        return;
      }

      console.log('Response from razorpay function:', responseData);

      if (!responseData?.payment_link) {
        console.error('No payment link received:', responseData);
        toast.error("Payment Link Error", {
          description: "No payment link received from gateway. Please try again."
        });
        if (onError) onError(new Error('No payment link received'));
        return;
      }

      console.log('Payment link created:', responseData.payment_link);
      
      const paymentIntent = {
        courseId,
        amount,
        currency,
        userId: user.id,
        timestamp: new Date().getTime(),
        payment_id: responseData.payment_id
      };
      
      console.log('Storing payment intent in session storage:', paymentIntent);
      sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
      
      // Redirect to Razorpay payment page
      window.location.href = responseData.payment_link;

    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error("Payment Failed", {
        description: error.message || "Failed to initialize payment"
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
