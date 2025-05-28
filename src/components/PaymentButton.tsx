
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
        toast.error("Payment gateway is still loading. Please wait a moment and try again.");
        return;
      }
      
      console.log('Creating Razorpay order for enrollment:', { courseId, studentId, amount });
      
      const orderData = await createRazorpayOrder(amount, courseId, studentId);
      if (!orderData) {
        console.error('Failed to create order');
        toast.error("Failed to create payment order. Please try again.");
        return;
      }

      console.log('Order created successfully for enrollment:', orderData);

      const options = {
        key: orderData.key,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Music Course Platform",
        description: "Course Enrollment Payment",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            console.log('Payment successful, processing enrollment:', response);
            
            toast.success('Payment successful!', {
              description: 'Processing your enrollment...'
            });
            
            // This will now handle both payment verification AND student enrollment
            const verificationResult = await verifyPayment(response, courseId, studentId);
            
            if (verificationResult && verificationResult.enrollment_confirmed) {
              console.log('Student successfully enrolled after payment');
              toast.success('Enrollment Complete!', {
                description: 'You are now enrolled in this course'
              });
              
              if (onSuccess) onSuccess(verificationResult);
              
              // Redirect to course page after successful enrollment
              setTimeout(() => {
                window.location.href = `/courses/${courseId}?enrollment=success`;
              }, 2000);
            } else {
              console.warn('Payment verified but enrollment not confirmed');
              if (onSuccess) onSuccess(verificationResult);
            }
          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error('Enrollment Failed', {
              description: 'Payment was successful but enrollment failed. Please contact support.'
            });
            if (onError) onError(error);
          }
        },
        prefill: {
          email: "student@example.com"
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

      console.log('Opening Razorpay checkout for enrollment:', options);
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
      disabled={loading || !razorpay}
      className={className}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {!razorpay ? 'Loading Payment Gateway...' : children}
    </Button>
  );
};
