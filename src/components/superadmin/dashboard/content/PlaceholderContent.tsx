
import React from 'react';
import ContentWrapper from './ContentWrapper';
import { Card } from '@/components/ui/card';

interface PlaceholderContentProps {
  tab: string;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ tab }) => {
  // Format the title and description properly
  const formatTitle = (tabName: string) => {
    // Handle camelCase by inserting spaces
    const formatted = tabName.replace(/([A-Z])/g, ' $1').trim();
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const title = `${formatTitle(tab)} Module`;
  const description = `${formatTitle(tab)} management functionality`;

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
