
import React from 'react';

interface LoadingIndicatorProps {
  height?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ height = "500px" }) => {
  return (
    <div className={`flex justify-center items-center h-64`} style={{ height }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
    </div>
  );
};

export default LoadingIndicator;
