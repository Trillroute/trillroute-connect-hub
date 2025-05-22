
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  height?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ height = "500px" }) => {
  return (
    <div 
      className="w-full flex items-center justify-center border rounded-md"
      style={{ height }}
    >
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
