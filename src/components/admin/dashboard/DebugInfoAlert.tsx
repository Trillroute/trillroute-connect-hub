
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DebugInfoAlertProps {
  debugInfo: string | null;
}

const DebugInfoAlert: React.FC<DebugInfoAlertProps> = ({ debugInfo }) => {
  if (!debugInfo) return null;
  
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>Debug Information</AlertTitle>
      <AlertDescription>{debugInfo}</AlertDescription>
    </Alert>
  );
};

export default DebugInfoAlert;
