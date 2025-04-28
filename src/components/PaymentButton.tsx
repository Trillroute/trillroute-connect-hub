
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRazorpay } from '@/hooks/useRazorpay';
import { usePaymentData } from '@/hooks/usePaymentData';
import { createRazorpayOrder, verifyPayment } from '@/utils/razorpayConfig';

interface PaymentButtonProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
  courseId: string;
  amount: number;
}

export const PaymentButton = ({
  onSuccess,
  onError,
  className,
  children = 'Pay Now',
  courseId,
  amount
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const razorpay = useRazorpay();
  const { createPaymentData, updatePaymentData, getPaymentData } = usePaymentData(courseId, user?.id);

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

      if (!razorpay) {
        toast.error("Payment Gateway", {
          description: "Payment gateway is still loading. Please try again in a moment."
        });
        return;
      }
      
      // Clear existing payment data and create new entry
      sessionStorage.removeItem(`payment_${courseId}`);
      const paymentData = createPaymentData();
      if (!paymentData) return;

      toast.info("Creating Payment", { description: "Setting up your payment..." });
      
      const orderData = await createRazorpayOrder(amount, courseId, user.id);
      updatePaymentData({ razorpayOrderId: orderData.orderId });

      const options = {
        key: orderData.key,
        amount: amount * 100,
        currency: "INR",
        name: "Music Course Platform",
        description: "Course Enrollment Payment",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            updatePaymentData({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              completed: true,
              completedTime: Date.now()
            });
            
            toast.success('Payment Successful', {
              description: 'Processing your enrollment...'
            });
            
            await verifyPayment(response, courseId, user.id);
            if (onSuccess) onSuccess(response);
          } catch (error) {
            console.error('Error in payment handler:', error);
            // Still redirect since payment might have succeeded
            window.location.href = `/courses/${courseId}?enrollment=success`;
          }
        },
        prefill: {
          name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email,
          email: user.email
        },
        theme: {
          color: "#9b87f5"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            
            // Check if this was potentially a QR code payment
            setTimeout(() => {
              const currentPaymentData = getPaymentData();
              
              if (currentPaymentData && !currentPaymentData.cancelled && !currentPaymentData.completed) {
                toast.info("QR Code Payment?", {
                  description: "If you completed payment via QR code, press 'Check Payment Status'",
                  action: {
                    label: "Check Payment Status",
                    onClick: () => {
                      // Mark that we're checking QR payment
                      updatePaymentData({
                        qrCodePaymentCheck: true,
                        qrCheckTime: Date.now()
                      });
                      
                      // Show checking status
                      const checkingToast = toast.loading("Checking Payment Status...");
                      
                      // Attempt to verify enrollment with backend directly
                      verifyPayment(
                        { 
                          razorpay_payment_id: `qr_payment_${Date.now()}`,
                          razorpay_order_id: orderData.orderId,
                          razorpay_signature: ''
                        }, 
                        courseId, 
                        user.id
                      ).then(() => {
                        toast.dismiss(checkingToast);
                        toast.success("Verification Request Sent", {
                          description: "We're processing your payment. The page will update shortly."
                        });
                        
                        // Force reload after a short delay to ensure backend has time to process
                        setTimeout(() => {
                          window.location.href = `/courses/${courseId}?enrollment=success`;
                        }, 2000);
                      }).catch(error => {
                        toast.dismiss(checkingToast);
                        toast.error("Verification Error", {
                          description: "Please try refreshing the page in a moment."
                        });
                        console.error("QR payment verification error:", error);
                      });
                    }
                  }
                });
              } else if (currentPaymentData) {
                toast.info("Payment Cancelled", {
                  description: "You can try again when you're ready"
                });
                
                updatePaymentData({
                  cancelled: true,
                  cancelTime: Date.now()
                });
              }
            }, 1000);
          }
        }
      };

      const razorpayInstance = new razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment Failed", {
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
