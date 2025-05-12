
import { useState, useMemo } from 'react';
import { isAfter, isFuture } from 'date-fns';
import { CalendarEvent } from '../context/calendarTypes';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { convertSlotToDisplayItem, EventItem, SlotItem, ListItem } from '../utils/listViewUtils';

interface UseListViewProps {
  events: CalendarEvent[];
  dailyAvailability: DayAvailability[];
}

export const useListView = ({ events, dailyAvailability }: UseListViewProps) => {
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Process availability slots into a comparable format to events
  const availabilityItems = useMemo(() => {
    if (!dailyAvailability || !Array.isArray(dailyAvailability)) {
      console.log("No daily availability data found");
      return [];
    }
    
    return dailyAvailability.flatMap(day => 
      day.slots.map(slot => 
        convertSlotToDisplayItem(slot, day.dayName, day.dayOfWeek)
      )
    );
  }, [dailyAvailability]);
  
  // Combine and filter events and availability slots
  const combinedItems = useMemo(() => {
    // Convert events to a common format with proper typing
    const eventItems: EventItem[] = events.map(event => ({
      ...event,
      isSlot: false
    }));
    
    // Combine events and availability slots with proper typing
    const allItems: ListItem[] = [...eventItems, ...availabilityItems]
      // Filter only future items for upcoming tab, otherwise show all
      .filter(item => activeTab === "upcoming" ? isFuture(item.start) : true)
      .sort((a, b) => a.start.getTime() - b.start.getTime()); // Sort by start time
    
    return allItems;
  }, [events, availabilityItems, activeTab]);
  
  // Filter based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === "events") {
      return combinedItems.filter(item => !item.isSlot);
    } else if (activeTab === "slots") {
      return combinedItems.filter(item => item.isSlot);
    } else if (activeTab === "upcoming") {
      return combinedItems; // Already filtered in combinedItems
    }
    return combinedItems;
  }, [combinedItems, activeTab]);
  
  // Get the limited set of items to display based on the displayCount
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, displayCount);
  }, [filteredItems, displayCount]);
  
  // Function to load more events
  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 20);
  };

  return {
    displayedItems,
    filteredItems,
    activeTab,
    setActiveTab,
    displayCount,
    handleShowMore
  };
};
