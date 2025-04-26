
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRazorpay } from '@/hooks/useRazorpay';

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
  const { initializePayment, loading } = useRazorpay();

  const handleClick = () => {
    initializePayment({
      amount,
      currency,
      onSuccess,
      onError,
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? 'Processing...' : children}
    </Button>
  );
};
