
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DebugInfoProps {
  message: string;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>Debug Information</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default DebugInfo;
