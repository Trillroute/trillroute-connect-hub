
import React, { useState } from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarContent from './CalendarContent';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilteredCalendarProps {
  title: string;
  description?: string;
  filterType?: 'role' | 'course' | 'user' | 'skill';
  filterValues?: string[];
  userIds?: string[];
  hasAdminAccess?: boolean;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
}

const FilteredCalendar: React.FC<FilteredCalendarProps> = ({ 
  title,
  description,
  filterType,
  filterValues = [],
  userIds = [],
  hasAdminAccess = false,
  isCollapsible = false,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const calendarContent = (
    <div className="flex-1 border rounded-md bg-white overflow-hidden">
      <CalendarProvider>
        <CalendarContent 
          hasAdminAccess={hasAdminAccess} 
          userId={userIds.length === 1 ? userIds[0] : undefined}
          userIds={userIds.length > 1 ? userIds : undefined}
          roleFilter={filterType === 'role' ? filterValues : undefined}
          courseId={filterType === 'course' ? filterValues[0] : undefined}
          skillId={filterType === 'skill' ? filterValues[0] : undefined}
        />
      </CalendarProvider>
    </div>
  );

  if (isCollapsible) {
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        className="mb-6 border rounded-lg bg-white"
      >
        <div className="flex items-center p-4 border-b cursor-pointer">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        <CollapsibleContent className="p-4">
          {calendarContent}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {calendarContent}
    </div>
  );
};

export default FilteredCalendar;
