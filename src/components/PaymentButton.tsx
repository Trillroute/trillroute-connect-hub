
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

      console.log('Creating payment link for user:', user.id, 'course:', courseId);

      const { data, error } = await supabase.functions.invoke('razorpay', {
        body: { 
          amount,
          currency,
          user_id: user.id,
          course_id: courseId
        },
      });

      if (error) {
        console.error('Razorpay function error:', error);
        throw error;
      }

      if (!data?.payment_link) {
        console.error('No payment link received:', data);
        throw new Error('No payment link received');
      }

      console.log('Payment link created:', data.payment_link);
      
      const paymentIntent = {
        courseId,
        amount,
        currency,
        userId: user.id,
        timestamp: new Date().getTime(),
        payment_id: data.payment_id
      };
      
      console.log('Storing payment intent in session storage:', paymentIntent);
      sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
      
      window.location.href = data.payment_link;

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
