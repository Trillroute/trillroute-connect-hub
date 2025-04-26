
import React, { useState, useEffect } from 'react';
import { getOrderStatus, getRazorpayOrderDetails } from '@/utils/orderUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface OrderStatusDisplayProps {
  orderId: string;
  className?: string;
}

export const OrderStatusDisplay = ({ orderId, className }: OrderStatusDisplayProps) => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [razorpayData, setRazorpayData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch order from our database
      const dbOrderData = await getOrderStatus(orderId);
      setOrderData(dbOrderData);
      
      // Fetch detailed order from Razorpay
      const razorpayOrderData = await getRazorpayOrderDetails(orderId);
      setRazorpayData(razorpayOrderData);
    } catch (err) {
      console.error('Error fetching order data:', err);
      setError(err.message || 'Failed to fetch order details');
      toast.error('Order Fetch Failed', {
        description: 'Could not retrieve order information'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-red-700 font-medium">Error loading order</h2>
        <p className="text-red-600">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={fetchOrderDetails}
        >
          Retry
        </Button>
      </div>
    );
  }

  const renderOrderStatus = () => {
    const status = orderData?.status || 'unknown';
    const statusColorMap = {
      completed: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      unknown: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColorMap[status] || statusColorMap.unknown}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className={`border rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-medium">{orderId}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Status</p>
          {renderOrderStatus()}
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="font-medium">₹{orderData?.amount || 'N/A'}</p>
        </div>
        
        {razorpayData?.order && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Razorpay Details</h3>
            
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {new Date(razorpayData.order.created_at * 1000).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="font-medium">{razorpayData.order.currency}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Receipt</p>
                <p className="font-medium">{razorpayData.order.receipt || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Payment Attempts</p>
                <p className="font-medium">{razorpayData.order.attempts || 0}</p>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          className="mt-4 w-full"
          onClick={fetchOrderDetails}
        >
          Refresh Order Status
        </Button>
      </div>
    </div>
  );
};
