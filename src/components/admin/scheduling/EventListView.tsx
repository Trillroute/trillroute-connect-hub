
import React from 'react';
import { CalendarEvent } from './context/calendarTypes';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { useListView } from './hooks/useListView';
import ListViewItem from './list-view/ListViewItem';
import ListViewTabs from './list-view/ListViewTabs';
import ShowMoreButton from './list-view/ShowMoreButton';
import EmptyStateCard from './list-view/EmptyStateCard';
import EmptyFilteredResults from './list-view/EmptyFilteredResults';

interface EventListViewProps {
  events: CalendarEvent[];
  dailyAvailability: DayAvailability[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

const EventListView: React.FC<EventListViewProps> = ({ 
  events, 
  dailyAvailability, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  const {
    displayedItems,
    filteredItems,
    activeTab,
    setActiveTab,
    displayCount,
    handleShowMore
  } = useListView({ events, dailyAvailability });
  
  if (filteredItems.length === 0) {
    return <EmptyStateCard activeTab={activeTab} />;
  }

  return (
    <div className="space-y-4 pb-6">
      <ListViewTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {displayedItems.length === 0 ? (
        <EmptyFilteredResults activeTab={activeTab} />
      ) : (
        <>
          {/* Item list */}
          <div className="space-y-4">
            {displayedItems.map((item) => (
              <ListViewItem
                key={`${item.isSlot ? 'slot' : 'event'}-${item.id}`}
                item={item}
                onEditEvent={onEditEvent}
                onDeleteEvent={onDeleteEvent}
              />
            ))}
          </div>
          
          {/* Show more button */}
          <ShowMoreButton 
            displayCount={displayCount}
            totalCount={filteredItems.length}
            activeTab={activeTab}
            onShowMore={handleShowMore}
          />
        </>
      )}
    </div>
  );
};

export default EventListView;
