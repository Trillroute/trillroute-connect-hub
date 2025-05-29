
import React from 'react';
import { CalendarEvent } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

interface EventListViewProps {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  showAvailability?: boolean;
}

const EventListView: React.FC<EventListViewProps> = ({
  events,
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  showAvailability = true
}) => {
  console.log('EventListView: Rendering with events:', events.length);

  const formatEventTime = (start: Date, end: Date) => {
    try {
      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.warn('Invalid dates provided to formatEventTime:', { start, end });
        return 'Invalid time';
      }
      
      const startStr = format(start, 'MMM dd, yyyy - h:mm a');
      const endStr = format(end, 'h:mm a');
      return `${startStr} to ${endStr}`;
    } catch (error) {
      console.error('Error formatting event time:', error, { start, end });
      return 'Invalid time';
    }
  };

  // Use the same color scheme as EventColorPicker and other views
  const getEventColor = (event: CalendarEvent) => {
    // Check if it's a trial class
    const isTrialClass = event.title?.toLowerCase().includes('trial') || 
                        event.description?.toLowerCase().includes('trial') ||
                        event.eventType?.toLowerCase().includes('trial');
    
    if (isTrialClass) {
      return '#F97316'; // Orange for trial classes
    }

    // Check event type for other categories
    const eventType = event.eventType?.toLowerCase();
    switch (eventType) {
      case 'break':
        return '#3B82F6'; // Blue for breaks
      case 'office':
        return '#8B5CF6'; // Purple for office
      case 'meeting':
        return '#F59E0B'; // Yellow for meetings
      case 'qc':
        return '#EC4899'; // Pink for QC
      default:
        return '#10B981'; // Green for regular sessions
    }
  };

  const getEventTypeBackgroundClass = (event: CalendarEvent) => {
    // Check if it's a trial class
    const isTrialClass = event.title?.toLowerCase().includes('trial') || 
                        event.description?.toLowerCase().includes('trial') ||
                        event.eventType?.toLowerCase().includes('trial');
    
    if (isTrialClass) {
      return 'bg-orange-100 border-orange-300 text-orange-800';
    }

    // Check event type for other categories
    const eventType = event.eventType?.toLowerCase();
    switch (eventType) {
      case 'break':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'office':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'meeting':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'qc':
        return 'bg-pink-100 border-pink-300 text-pink-800';
      default:
        return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No events to display</p>
        {onCreateEvent && (
          <Button 
            onClick={onCreateEvent} 
            className="mt-4"
            variant="outline"
          >
            Create New Event
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onCreateEvent && (
        <div className="flex justify-end mb-4">
          <Button onClick={onCreateEvent}>
            Create New Event
          </Button>
        </div>
      )}
      
      {events.map((event) => {
        console.log('EventListView: Rendering event:', {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          eventType: event.eventType
        });

        const eventColor = getEventColor(event);

        return (
          <Card 
            key={event.id} 
            className="w-full cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => onEditEvent(event)}
            style={{ borderLeftColor: eventColor, borderLeftWidth: '4px' }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(event);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEvent(event);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {formatEventTime(event.start, event.end)}
                  </span>
                </div>
                
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    className={`${getEventTypeBackgroundClass(event)} border`}
                  >
                    {event.eventType || 'class'}
                  </Badge>
                  
                  {event.metadata?.teacherName && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        Teacher: {event.metadata.teacherName}
                      </span>
                    </div>
                  )}
                  
                  {event.metadata?.studentName && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        Student: {event.metadata.studentName}
                      </span>
                    </div>
                  )}

                  {event.userId && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        User ID: {event.userId.substring(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EventListView;
