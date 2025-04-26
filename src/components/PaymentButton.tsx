
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRazorpay } from '@/hooks/useRazorpay';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export const PaymentButton = ({
  amount,
  currency = 'INR',
  onSuccess,
  onError,
  className,
  children = 'Pay Now'
}: PaymentButtonProps) => {
  const { initializePayment, loading, scriptLoaded, checkRazorpayAvailability } = useRazorpay();
  
  useEffect(() => {
    // Check Razorpay availability on mount and periodically
    const checkInterval = setInterval(() => {
      checkRazorpayAvailability();
    }, 3000);
    
    // Log payment button mount and script status
    console.log('Payment button mounted, script loaded:', scriptLoaded);
    
    return () => clearInterval(checkInterval);
  }, [scriptLoaded, checkRazorpayAvailability]);

  const handleClick = () => {
    // Check if the amount is valid (greater than 0)
    if (!amount || amount <= 0) {
      // If amount is 0 or negative, handle as free enrollment
      if (onSuccess) {
        toast.success("Free Enrollment", {
          description: "This is a free course. Processing your enrollment..."
        });
        // Call onSuccess directly for free courses
        onSuccess({ free_enrollment: true });
      }
      return;
    }
    
    // Force a check of Razorpay availability before proceeding
    checkRazorpayAvailability();
    
    // Check if script is loaded before proceeding
    if (!scriptLoaded) {
      toast("Payment System Loading", {
        description: "Please wait while we initialize the payment system."
      });
      return;
    }
    
    // Otherwise proceed with payment
    initializePayment({
      amount,
      currency,
      onSuccess,
      onError,
    });
  };

  // Determine button text based on state
  const buttonText = () => {
    if (loading) return 'Processing...';
    if (!scriptLoaded && amount > 0) return 'Loading Payment...';
    return amount > 0 ? children : 'Enroll for Free';
  };

  // Determine button disabled state
  const isDisabled = () => {
    if (amount <= 0) return false; // Free courses can always be enrolled
    return loading || !scriptLoaded; // Paid courses need payment system ready
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled()}
      className={className}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!scriptLoaded && amount > 0 && !loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonText()}
    </Button>
  );
};
