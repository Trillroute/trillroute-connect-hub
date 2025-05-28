
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PlaceholderContentProps {
  title?: string;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ title = "Coming Soon" }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">This feature is under development.</p>
      </CardContent>
    </Card>
  );
};

export default PlaceholderContent;
