
import React, { useCallback, useMemo } from 'react';
import { format, isToday } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../types';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvailability } from '@/services/availability/types';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { transformAvailabilityData } from '@/hooks/availability/availabilityTransforms';

interface LegacyViewComponentProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const LegacyViewComponent: React.FC<LegacyViewComponentProps> = React.memo(({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const { currentDate, events } = useCalendar();
  const { availabilities, isLoading } = useStaffAvailability();

  // Get events for the current date
  const todayEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events, currentDate]);

  // Transform availability data for display
  const availabilitySlots = useMemo(() => {
    if (!availabilities || isLoading) return [];
    
    const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const availabilityForToday: UserAvailability[] = [];
    
    // Collect all availability slots for the current day of week
    Object.values(availabilities).forEach(userAvailability => {
      if (userAvailability && userAvailability.slots) {
        const todaySlots = userAvailability.slots.filter(slot => slot.dayOfWeek === dayOfWeek);
        if (todaySlots.length > 0) {
          // Add user name to each slot
          todaySlots.forEach(slot => {
            availabilityForToday.push({
              ...slot,
              userName: userAvailability.name || 'Staff'
            });
          });
        }
      }
    });

    return availabilityForToday.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  }, [availabilities, currentDate, isLoading]);

  // Format time string for display
  const formatTimeString = useCallback((timeString: string) => {
    // Parse the time string (format: "HH:MM:SS") and return it as "h:mm a"
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  }, []);

  // Get category color for availability slots
  const getCategoryColor = useCallback((category: string) => {
    switch (category.toLowerCase()) {
      case 'session':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'break':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'office':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'meeting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'class setup':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'qc':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    if (onEditEvent) {
      onEditEvent(event);
    }
  }, [onEditEvent]);

  return (
    <div className="flex flex-col h-full border rounded-md bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          {isToday(currentDate) ? 'Today' : format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      
      <div className="flex flex-col flex-1 overflow-auto p-4">
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3 text-muted-foreground">Availability Slots</h3>
          {availabilitySlots.length > 0 ? (
            <div className="space-y-2">
              {availabilitySlots.map((slot, index) => (
                <div 
                  key={`avail-${slot.id}-${index}`}
                  className={cn(
                    "p-3 rounded-md border",
                    getCategoryColor(slot.category)
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{slot.userName || 'Staff'}</div>
                      <div className="text-sm">
                        {formatTimeString(slot.startTime)} - {formatTimeString(slot.endTime)}
                      </div>
                    </div>
                    <Badge>{slot.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground bg-muted/30 rounded-md">
              No availability slots for today
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-3 text-muted-foreground">Events</h3>
          {todayEvents.length > 0 ? (
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-md p-3 cursor-pointer hover:shadow-md transition-shadow bg-card"
                  onClick={() => handleEventClick(event)}
                >
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center text-muted-foreground mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                  )}
                  <div
                    className="w-full h-1 mt-3"
                    style={{ backgroundColor: event.color || '#4285F4' }}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground bg-muted/30 rounded-md">
              No events scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LegacyViewComponent.displayName = 'LegacyViewComponent';
