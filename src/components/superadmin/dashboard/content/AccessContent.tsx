
import React from 'react';
import ContentWrapper from './ContentWrapper';
import { Card } from '@/components/ui/card';

const AccessContent: React.FC = () => {
  return (
    <ContentWrapper 
      title="Access Module"
      description="Access management functionality"
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-gray-500 text-center">
            We're currently working on enhancing this feature.
          </p>
        </div>
      </Card>
    </ContentWrapper>
  );
};

export default AccessContent;
