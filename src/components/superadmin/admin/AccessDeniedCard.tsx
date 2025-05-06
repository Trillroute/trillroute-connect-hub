
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AccessDeniedCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8">
        <h3 className="text-lg font-medium">Permission Denied</h3>
        <p className="text-gray-500">You don't have permission to manage administrators.</p>
      </CardContent>
    </Card>
  );
};

export default AccessDeniedCard;
