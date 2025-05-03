
import React from 'react';
import ContentWrapper from './ContentWrapper';
import { Card } from '@/components/ui/card';

interface PlaceholderContentProps {
  tab: string;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ tab }) => {
  const title = `${tab.charAt(0).toUpperCase() + tab.slice(1)} Module`;
  const description = `${tab.charAt(0).toUpperCase() + tab.slice(1)} management functionality`;

  return (
    <ContentWrapper 
      title={title}
      description={description}
    >
      <Card className="p-6">
        <p>This module is under development.</p>
      </Card>
    </ContentWrapper>
  );
};

export default PlaceholderContent;
