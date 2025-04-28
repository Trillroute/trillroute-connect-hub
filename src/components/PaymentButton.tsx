
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
  const { user, isAuthenticated } = useAuth();

  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  // Clear any stale payment data for this course on component mount
  useEffect(() => {
    const clearStalePaymentData = () => {
      const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
      if (paymentDataStr) {
        try {
          const paymentData = JSON.parse(paymentDataStr);
          // Check if data is stale (older than 24 hours)
          if (Date.now() - paymentData.timestamp > 86400000) {
            console.log('Clearing stale payment data for course:', courseId);
            sessionStorage.removeItem(`payment_${courseId}`);
          }
        } catch (e) {
          console.error('Error parsing payment data:', e);
          sessionStorage.removeItem(`payment_${courseId}`);
        }
      }
    };
    
    clearStalePaymentData();
  }, [courseId]);

  const handleClick = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      if (!user) {
        toast.error("Authentication Required", {
          description: "Please login to enroll in this course"
        });
        
        localStorage.setItem('enrollRedirectUrl', `/courses/${courseId}`);
        navigate('/auth/login');
        return;
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error("Payment Gateway", {
          description: "Payment gateway is still loading. Please try again in a moment."
        });
        return;
      }
      
      // Clear any existing payment data for this course
      sessionStorage.removeItem(`payment_${courseId}`);

      // Create payment data and store in session
      const paymentData = {
        courseId,
        userId: user.id,
        timestamp: Date.now(),
        completed: false,
        processed: false,
        startTime: Date.now()
      };
      sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(paymentData));
      console.log('Payment data created:', paymentData);

      // Inform user
      toast.info("Creating Payment", { description: "Setting up your payment..." });
      
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, courseId, userId: user.id }
      });

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error("Order Creation Failed", {
          description: "Failed to create payment order. Please try again."
        });
        if (onError) onError(orderError);
        setLoading(false);
        return;
      }

      if (!orderData || !orderData.orderId || !orderData.key) {
        console.error('Invalid order data received:', orderData);
        toast.error("Payment Setup Failed", {
          description: "Invalid payment configuration. Please try again."
        });
        setLoading(false);
        return;
      }

      // Update payment data with order ID
      const updatedData = {
        ...paymentData,
        razorpayOrderId: orderData.orderId
      };
      sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(updatedData));
      console.log('Payment data updated with order ID:', updatedData);

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: amount * 100,
        currency: "INR",
        name: "Music Course Platform",
        description: "Course Enrollment Payment",
        order_id: orderData.orderId,
        handler: function(response: any) {
          try {
            console.log('Payment successful response:', response);
            
            // Get the current payment data
            const currentDataStr = sessionStorage.getItem(`payment_${courseId}`);
            if (!currentDataStr) {
              console.log('Payment data not found, creating new entry');
              // Create new payment data if none exists
              const newPaymentData = {
                courseId,
                userId: user.id,
                timestamp: Date.now(),
                razorpayOrderId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                completed: true,
                processed: false,
                completedTime: Date.now()
              };
              sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(newPaymentData));
              console.log('Created new payment data:', newPaymentData);
            } else {
              // Update existing payment data
              const currentData = JSON.parse(currentDataStr);
              const completedData = {
                ...currentData,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                completed: true,
                completedTime: Date.now()
              };
              sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(completedData));
              console.log('Payment data updated on completion:', completedData);
            }
            
            // Show success toast
            toast.success('Payment Successful', {
              description: 'Processing your enrollment...'
            });
            
            // Verify payment on server
            supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                course_id: courseId
              }
            }).then(({data, error}) => {
              if (error) {
                console.error('Payment verification error:', error);
                // Don't show error toast since payment might still be successful
                window.location.href = `/courses/${courseId}?enrollment=success`;
                return;
              }
              
              console.log('Payment verified by backend:', data);
              window.location.href = `/courses/${courseId}?enrollment=success&payment=verified`;
              
              if (onSuccess) onSuccess(response);
            });
          } catch (error) {
            console.error('Error in payment handler:', error);
            // Still redirect to success since the payment might be successful
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
            toast.info("Payment Cancelled", {
              description: "You can try again when you're ready"
            });
            
            // Update payment data on cancellation
            const currentDataStr = sessionStorage.getItem(`payment_${courseId}`);
            if (currentDataStr) {
              const currentData = JSON.parse(currentDataStr);
              currentData.cancelled = true;
              currentData.cancelTime = Date.now();
              sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(currentData));
            }
          }
        }
      };

      // Open Razorpay payment window
      const razorpay = new window.Razorpay(options);
      razorpay.open();

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
