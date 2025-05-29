
import React from 'react';
import { CalendarEvent } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock, MapPin, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { getEventColor, getEventTypeBackgroundClass, isAvailabilitySlot } from './eventColorUtils';

interface EventCardProps {
  event: CalendarEvent;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEditEvent,
  onDeleteEvent,
  onCreateEvent
}) => {
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

  const handleCardClick = (event: CalendarEvent) => {
    // For availability slots, trigger create event instead of edit
    if (event.eventType === 'availability' && onCreateEvent) {
      onCreateEvent();
    } else {
      onEditEvent(event);
    }
  };

  console.log('EventCard: Rendering event:', {
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    eventType: event.eventType
  });

  const eventColor = getEventColor(event);
  const isAvailability = isAvailabilitySlot(event);

  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => handleCardClick(event)}
      style={{ borderLeftColor: eventColor, borderLeftWidth: '4px' }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {isAvailability && <Calendar className="h-4 w-4 text-gray-500" />}
              {event.title}
            </CardTitle>
            {event.description && (
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {!isAvailability && (
              <>
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
              </>
            )}
            {isAvailability && onCreateEvent && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateEvent();
                }}
              >
                Book Slot
              </Button>
            )}
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
              {isAvailability ? 'available' : (event.eventType || 'class')}
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

            {event.metadata?.userName && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {isAvailability ? 'Available:' : 'User:'} {event.metadata.userName}
                </span>
              </div>
            )}

            {event.userId && !event.metadata?.userName && (
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
};

export default EventCard;
