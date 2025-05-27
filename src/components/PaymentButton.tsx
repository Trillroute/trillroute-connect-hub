
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { createRazorpayOrder, verifyPayment } from '@/utils/razorpayConfig';

interface PaymentButtonProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
  courseId: string;
  amount: number;
  studentId: string;
}

export const PaymentButton = ({
  onSuccess,
  onError,
  className,
  children = 'Pay Now',
  courseId,
  amount,
  studentId
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const razorpay = useRazorpay();

  const handleClick = async () => {
    try {
      setLoading(true);
      
      console.log('PaymentButton clicked with params:', { courseId, studentId, amount });
      
      if (!courseId || !amount || !studentId) {
        console.error('Missing payment parameters:', { courseId, studentId, amount });
        toast.error("Invalid payment parameters");
        return;
      }

      if (!razorpay) {
        console.error('Razorpay not loaded yet');
        toast.error("Payment gateway is loading. Please try again in a moment.");
        return;
      }
      
      console.log('Creating Razorpay order for:', { courseId, studentId, amount });
      
      const orderData = await createRazorpayOrder(amount, courseId, studentId);
      if (!orderData) {
        console.error('Failed to create order');
        toast.error("Failed to create payment order");
        return;
      }

      console.log('Order created successfully:', orderData);

      const options = {
        key: orderData.key,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Music Course Platform",
        description: "Course Enrollment Payment",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            console.log('Payment successful, verifying:', response);
            
            toast.success('Payment successful!', {
              description: 'Processing your enrollment...'
            });
            
            await verifyPayment(response, courseId, studentId);
            if (onSuccess) onSuccess(response);
          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error('Payment verification failed', {
              description: 'Please contact support if payment was deducted.'
            });
            if (onError) onError(error);
          }
        },
        prefill: {
          email: "student@example.com" // This will be filled from student data if available
        },
        theme: {
          color: "#9b87f5"
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setLoading(false);
            toast.info("Payment cancelled", {
              description: "You can try again when you're ready"
            });
          }
        }
      };

      console.log('Opening Razorpay checkout with options:', options);
      const razorpayInstance = new razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed", {
        description: "Failed to process payment. Please try again."
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
