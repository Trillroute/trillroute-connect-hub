
import { useEffect } from 'react';

interface PaymentData {
  courseId: string;
  userId: string;
  timestamp: number;
  completed?: boolean;
  processed?: boolean;
  startTime: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  cancelled?: boolean;
  cancelTime?: number;
  completedTime?: number;
  qrCodePaymentCheck?: boolean;
  qrCheckTime?: number;
}

export const usePaymentData = (courseId: string, userId?: string) => {
  useEffect(() => {
    const clearStalePaymentData = () => {
      const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
      if (paymentDataStr) {
        try {
          const paymentData = JSON.parse(paymentDataStr);
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

  const createPaymentData = () => {
    if (!userId) return null;
    
    const paymentData: PaymentData = {
      courseId,
      userId,
      timestamp: Date.now(),
      completed: false,
      processed: false,
      startTime: Date.now()
    };
    sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(paymentData));
    console.log('Payment data created:', paymentData);
    return paymentData;
  };

  const updatePaymentData = (data: Partial<PaymentData>) => {
    const currentDataStr = sessionStorage.getItem(`payment_${courseId}`);
    if (currentDataStr) {
      const currentData = JSON.parse(currentDataStr);
      const updatedData = { ...currentData, ...data };
      sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(updatedData));
      console.log('Payment data updated:', updatedData);
      return updatedData;
    }
    return null;
  };

  return { createPaymentData, updatePaymentData };
};
