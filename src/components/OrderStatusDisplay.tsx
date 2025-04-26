
import React, { useState, useEffect } from 'react';
import { getOrderStatus, getRazorpayOrderDetails } from '@/utils/orderUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';

interface OrderStatusDisplayProps {
  orderId: string;
  className?: string;
}

export const OrderStatusDisplay = ({ orderId, className }: OrderStatusDisplayProps) => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [razorpayData, setRazorpayData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch order from our database
      const dbOrderData = await getOrderStatus(orderId);
      console.log('Initial order data from DB:', dbOrderData);
      setOrderData(dbOrderData);
      
      // Fetch detailed order from Razorpay and update our database
      const razorpayOrderData = await getRazorpayOrderDetails(orderId);
      setRazorpayData(razorpayOrderData);
      
      // After updating with Razorpay data, fetch the latest from our database again
      const updatedDbData = await getOrderStatus(orderId);
      console.log('Updated order data after sync:', updatedDbData);
      setOrderData(updatedDbData);
      
      toast.success('Order Status Updated', {
        description: 'Latest order information retrieved'
      });
    } catch (err: any) {
      console.error('Error fetching order data:', err);
      setError(err.message || 'Failed to fetch order details');
      toast.error('Order Fetch Failed', {
        description: 'Could not retrieve order information'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails();
    toast.info('Refreshing Order Status', {
      description: 'Fetching the latest information from Razorpay'
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading && !refreshing) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 border rounded-lg shadow-sm bg-white ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center">Loading order details...</p>
        <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 border border-red-200 bg-red-50 rounded-lg shadow-sm ${className}`}>
        <h2 className="text-red-700 font-medium text-lg">Error loading order</h2>
        <p className="text-red-600 mt-2">{error}</p>
        <div className="mt-4 flex items-center gap-4">
          <p className="text-sm text-gray-600">Order ID: <span className="font-mono">{orderId}</span></p>
          <Button 
            variant="outline" 
            onClick={fetchOrderDetails}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
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
      unknown: 'bg-gray-100 text-gray-800 border-gray-300',
      paid: 'bg-green-100 text-green-800 border-green-300'
    };
    
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const razorpayStatus = razorpayData?.order?.status || '';
    const combinedStatus = razorpayStatus ? `${displayStatus} (Razorpay: ${razorpayStatus})` : displayStatus;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColorMap[status as keyof typeof statusColorMap] || statusColorMap.unknown}`}>
        {combinedStatus}
      </span>
    );
  };

  return (
    <div className={`border rounded-lg shadow-sm p-6 bg-white ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh Status
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Trillroute Order ID</p>
            <p className="font-mono text-sm break-all">{orderId}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            {renderOrderStatus()}
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Amount</p>
            <p className="font-medium">₹{orderData?.amount || 'N/A'}</p>
          </div>
        </div>
        
        {razorpayData?.order && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <img 
                src="https://razorpay.com/favicon.png" 
                alt="Razorpay" 
                className="h-5 w-5 mr-2" 
              />
              Razorpay Details
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Razorpay ID</p>
                <div className="flex items-center">
                  <p className="font-mono text-sm break-all">{razorpayData.order.id}</p>
                  {/* Disabled the external link as it would require authentication */}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm">
                  {new Date(razorpayData.order.created_at * 1000).toLocaleString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Currency</p>
                  <p className="text-sm">{razorpayData.order.currency}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Payment Attempts</p>
                  <p className="text-sm">{razorpayData.order.attempts || 0}</p>
                </div>
              </div>
              
              {razorpayData.order.notes && (
                <div>
                  <p className="text-xs text-gray-500">Notes</p>
                  <ul className="text-sm space-y-1 mt-1">
                    {Object.entries(razorpayData.order.notes).map(([key, value]: [string, any]) => (
                      <li key={key}>
                        <span className="text-gray-600">{key}: </span>
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
