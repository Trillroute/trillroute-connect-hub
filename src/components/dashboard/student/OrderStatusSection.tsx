
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OrderStatusDisplay } from '@/components/OrderStatusDisplay';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface OrderStatusSectionProps {
  orderId?: string | null;
}

export const OrderStatusSection = ({ orderId }: OrderStatusSectionProps) => {
  const [manualOrderId, setManualOrderId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const navigate = useNavigate();

  const handleViewOrder = () => {
    if (!manualOrderId.trim()) return;
    // Use navigate instead of window.location.href to prevent full page reload
    navigate(`/dashboard/student?orderId=${manualOrderId.trim()}`);
  };

  if (!orderId && !showManualInput) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-gray-600 mt-1">View status of your recent course purchases</p>
          </div>
          <Button 
            variant="ghost" 
            className="flex items-center text-music-500"
            onClick={() => setShowManualInput(true)}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Check Order Status
          </Button>
        </div>
      </div>
    );
  }

  if (showManualInput && !orderId) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Check Order Status</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={manualOrderId}
            onChange={(e) => setManualOrderId(e.target.value)}
            placeholder="Enter your Order ID"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-music-500"
          />
          <Button onClick={handleViewOrder} className="whitespace-nowrap">
            View Order
          </Button>
        </div>
        
        <button 
          onClick={() => setShowManualInput(false)}
          className="mt-3 text-sm text-gray-500 hover:text-music-500"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
        <Link 
          to="/dashboard/student" 
          className="text-sm text-music-500 hover:text-music-700 flex items-center"
        >
          Back to Dashboard
        </Link>
      </div>
      {orderId && <OrderStatusDisplay orderId={orderId} className="w-full" />}
    </div>
  );
};
