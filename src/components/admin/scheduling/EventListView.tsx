
import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from './context/calendarTypes';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { handleAvailabilitySlotClick } from './utils/availabilitySlotHandlers';

interface EventListViewProps {
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
  showAvailability?: boolean;
  availabilitySlots?: Array<{
    dayOfWeek: number;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    userId: string;
    userName?: string;
    category: string;
  }>;
}

const EventListView: React.FC<EventListViewProps> = ({ 
  events, 
  onEditEvent, 
  onDeleteEvent,
  showAvailability = true,
  availabilitySlots = []
}) => {
  if (events.length === 0 && availabilitySlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No events found</h3>
        <p className="text-gray-500 mt-1">
          There are no events scheduled for the selected period.
        </p>
      </div>
    );
  }

  const handleAvailabilityClick = (slot: any) => {
    handleAvailabilitySlotClick(slot);
  };

  return (
    <div className="space-y-4">
      {/* Events section */}
      {events.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Events</h3>
          <div className="divide-y divide-gray-200">
            {events.map(event => (
              <div
                key={event.id}
                className="flex justify-between items-center py-4 px-2 hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    {format(event.start, 'MMM d, yyyy')} • {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                  </div>
                  {event.location && (
                    <div className="text-sm text-gray-600 mt-1">
                      📍 {event.location}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {onEditEvent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEvent(event)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {onDeleteEvent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => onDeleteEvent(event)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Availability slots section */}
      {showAvailability && availabilitySlots.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Available Time Slots</h3>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {availabilitySlots.map((slot, index) => {
              const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const dayName = dayNames[slot.dayOfWeek];
              
              return (
                <TooltipProvider key={`${slot.userId}-${index}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="p-3 rounded-md shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                        style={{ 
                          backgroundColor: `${slot.category === 'Session' ? '#e6f7ed' : 
                                          slot.category === 'Break' ? '#e6f1fa' :
                                          slot.category === 'Office' ? '#f0e6fa' : '#f0f0f0'}`,
                          borderColor: `${slot.category === 'Session' ? '#9be6c0' : 
                                        slot.category === 'Break' ? '#9bc5e6' :
                                        slot.category === 'Office' ? '#c59be6' : '#d0d0d0'}`
                        }}
                        onClick={() => handleAvailabilityClick(slot)}
                      >
                        <div className="font-medium">{slot.userName || 'Available'}</div>
                        <div className="text-xs font-semibold mt-1">{dayName}</div>
                        <div className="text-sm mt-1">
                          {`${slot.startHour}:${slot.startMinute.toString().padStart(2, '0')} - ${slot.endHour}:${slot.endMinute.toString().padStart(2, '0')}`}
                        </div>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/50">
                            {slot.category}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p><strong>{slot.category}</strong> - {slot.userName || 'Available'}</p>
                      <p className="text-xs">Click to create an event</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListView;
