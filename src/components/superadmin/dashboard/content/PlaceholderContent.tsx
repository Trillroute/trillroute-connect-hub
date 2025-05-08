
import React from 'react';
import ContentWrapper from './ContentWrapper';
import { Card } from '@/components/ui/card';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';

interface PlaceholderContentProps {
  tab: string;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ tab }) => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  // Format the title and description properly
  const formatTitle = (tabName: string) => {
    // Handle camelCase by inserting spaces
    const formatted = tabName.replace(/([A-Z])/g, ' $1').trim();
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const title = `${formatTitle(tab)} Module`;
  const description = `${formatTitle(tab)} management functionality`;

  // If the tab is 'scheduling', show the calendar
  if (tab === 'scheduling') {
    return (
      <ContentWrapper 
        title="Calendar"
        description="View and manage all calendar events"
      >
        <div className="border rounded-lg bg-white overflow-hidden h-[600px]">
          <FilteredCalendar
            title="All Events"
            hasAdminAccess={hasAdminAccess}
          />
        </div>
      </ContentWrapper>
    );
  }

  // For other tabs, show a placeholder
  return (
    <ContentWrapper 
      title={title}
      description={description}
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

export default PlaceholderContent;
