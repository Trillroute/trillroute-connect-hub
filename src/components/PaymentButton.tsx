
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
  courseId: string; // Add courseId prop
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

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication Required", {
          description: "Please login to make a payment"
        });
        navigate('/auth/login', { 
          state: { redirectTo: `/courses/${courseId}` } 
        });
        return;
      }

      // Create payment link
      const { data, error } = await supabase.functions.invoke('razorpay', {
        body: { 
          amount,
          currency,
          user_id: user.id,
          course_id: courseId
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.payment_link) {
        throw new Error('No payment link received');
      }

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
