
import React, { useState, useMemo } from 'react';
import { format, isAfter, startOfDay, addMinutes, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Pencil, Trash2, Calendar, List } from 'lucide-react';
import { CalendarEvent } from './context/calendarTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EventListViewProps {
  events: CalendarEvent[];
  dailyAvailability: DayAvailability[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

// Helper to convert availability slot to a display-friendly format
const convertSlotToDisplayItem = (slot: any, dayName: string, dayNumber: number) => {
  // Parse the time strings into Date objects for easier comparison
  const today = new Date();
  const slotDate = new Date();
  
  // Set the date to the next occurrence of this day of week
  const currentDayNumber = today.getDay();
  let daysUntilSlot = dayNumber - currentDayNumber;
  if (daysUntilSlot <= 0) daysUntilSlot += 7; // Add a week if today or already passed
  
  slotDate.setDate(today.getDate() + daysUntilSlot);
  
  // Extract hours and minutes from the time strings
  const [startHour, startMinute] = slot.startTime.split(':').map(Number);
  const [endHour, endMinute] = slot.endTime.split(':').map(Number);
  
  // Set the hours and minutes for start and end
  const startDateTime = new Date(slotDate);
  startDateTime.setHours(startHour, startMinute, 0, 0);
  
  const endDateTime = new Date(slotDate);
  endDateTime.setHours(endHour, endMinute, 0, 0);
  
  return {
    id: slot.id,
    title: `${slot.category} Slot`,
    start: startDateTime,
    end: endDateTime,
    dayName,
    category: slot.category,
    isSlot: true
  };
};

const EventListView: React.FC<EventListViewProps> = ({ 
  events, 
  dailyAvailability, 
  onEditEvent, 
  onDeleteEvent 
}) => {
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
  
  console.log(`Processed ${availabilityItems.length} availability items`);
  
  // Combine and filter events and availability slots
  const combinedItems = useMemo(() => {
    const now = new Date();
    
    // Convert events to a common format
    const eventItems = events.map(event => ({
      ...event,
      isSlot: false
    }));
    
    // Combine events and availability slots
    const allItems = [...eventItems, ...availabilityItems]
      .filter(item => isAfter(item.start, now)) // Only future items
      .sort((a, b) => a.start.getTime() - b.start.getTime()); // Sort by start time
    
    console.log(`Combined ${allItems.length} total items (${eventItems.length} events, ${availabilityItems.length} slots)`);
    return allItems;
  }, [events, availabilityItems]);
  
  // Filter based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === "events") {
      return combinedItems.filter(item => !item.isSlot);
    } else if (activeTab === "slots") {
      return combinedItems.filter(item => item.isSlot);
    }
    return combinedItems;
  }, [combinedItems, activeTab]);
  
  // Get the limited set of items to display based on the displayCount
  const displayedItems = filteredItems.slice(0, displayCount);
  
  // Function to load more events
  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 20);
  };
  
  if (combinedItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="bg-muted rounded-full p-3 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No upcoming items</h3>
            <p className="text-muted-foreground text-center">
              No upcoming events or availability slots found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="slots">
            <List className="h-4 w-4 mr-2" />
            Slots
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500 text-center">
            <div className="text-lg mb-2">No upcoming {activeTab === "all" ? "items" : activeTab}</div>
            <div className="text-sm">
              {activeTab === "events" ? "No upcoming events scheduled" : 
               activeTab === "slots" ? "No availability slots configured" : 
               "No upcoming events or availability slots found"}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Item list */}
          <div className="space-y-4">
            {displayedItems.map((item) => (
              <div 
                key={`${item.isSlot ? 'slot' : 'event'}-${item.id}`} 
                className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <Badge variant={item.isSlot ? "outline" : "default"} className="font-normal">
                    {format(item.start, 'MMMM d, yyyy')}
                    {item.isSlot && ` (${(item as any).dayName})`}
                  </Badge>
                </div>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {format(item.start, 'h:mm a')} - {format(item.end, 'h:mm a')}
                  </span>
                </div>
                
                {!item.isSlot && item.location && (
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                )}
                
                {item.isSlot && (
                  <div className="text-sm text-gray-600 mb-4">
                    <Badge variant="secondary" className="font-normal">
                      {(item as any).category}
                    </Badge>
                  </div>
                )}
                
                {!item.isSlot && item.description && (
                  <p className="mt-2 text-sm text-gray-600 mb-4">{item.description}</p>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <div
                    className="w-1/3 h-2 rounded"
                    style={{ backgroundColor: item.isSlot ? 
                             (item as any).category === "Session" ? "#10b981" : 
                             (item as any).category === "Break" ? "#3b82f6" : 
                             (item as any).category === "Meeting" ? "#eab308" : "#6b7280"
                             : item.color || '#4285F4' }}
                  ></div>
                  
                  {!item.isSlot && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEditEvent(item as CalendarEvent)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600" 
                        onClick={() => onDeleteEvent(item as CalendarEvent)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Show more button */}
          {displayedItems.length < filteredItems.length && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={handleShowMore}
                className="w-full max-w-sm"
              >
                Show More ({filteredItems.length - displayedItems.length} {activeTab === "events" ? "events" : activeTab === "slots" ? "slots" : "items"} remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventListView;
