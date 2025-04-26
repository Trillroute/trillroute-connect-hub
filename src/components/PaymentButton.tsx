
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
    // Check if amount is valid
    if (!amount || amount <= 0) {
      if (onSuccess) {
        toast.success("Free Enrollment", {
          description: "This is a free course. Processing your enrollment..."
        });
        onSuccess({ free_enrollment: true });
      }
      return;
    }

    try {
      setLoading(true);
      
      // Double check if user is authenticated
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login...');
        toast.error("Authentication Required", {
          description: "Please login to make a payment"
        });
        
        // Store the current course URL to redirect back after login
        localStorage.setItem('paymentRedirectUrl', `/courses/${courseId}`);
        // Also store auth state to persist during redirect
        localStorage.setItem('authRedirectState', JSON.stringify({
          action: 'payment',
          courseId: courseId
        }));
        
        navigate('/auth/login');
        return;
      }

      console.log('User authenticated:', user.id);

      // Create payment link with authenticated user
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
      
      // Store user info in sessionStorage to maintain login state during redirect
      sessionStorage.setItem('pendingEnrollment', JSON.stringify({
        courseId: courseId,
        userId: user.id,
        timestamp: new Date().getTime()
      }));
      
      // Redirect to Razorpay payment page
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
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? 'Processing...' : amount > 0 ? children : 'Enroll for Free'}
    </Button>
  );
};
