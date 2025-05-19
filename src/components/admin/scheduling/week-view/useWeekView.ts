
import { useState, useEffect } from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { AvailabilitySlot } from './weekViewUtils';
import { UserAvailabilityMap } from '@/services/availability/types';

export const useWeekView = (
  availabilities: UserAvailabilityMap | null | undefined,
  events: CalendarEvent[],
  handleUpdateEvent: (id: string, eventData: Omit<CalendarEvent, 'id'>) => void,
  handleDeleteEvent: (id: string) => void
) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  
  // Process availability data for the week
  useEffect(() => {
    const processAvailabilities = () => {
      const processedSlots: AvailabilitySlot[] = [];
      
      // Process all user availabilities
      if (availabilities) {
        Object.entries(availabilities).forEach(([userId, userData]) => {
          if (userData && typeof userData === 'object' && 'slots' in userData && Array.isArray(userData.slots)) {
            userData.slots.forEach(slot => {
              if (slot.startTime && slot.endTime && typeof slot.dayOfWeek === 'number') {
                const startTimeParts = slot.startTime.split(':');
                const endTimeParts = slot.endTime.split(':');
                
                if (startTimeParts.length >= 2 && endTimeParts.length >= 2) {
                  const startHour = parseInt(startTimeParts[0], 10);
                  const startMinute = parseInt(startTimeParts[1], 10);
                  const endHour = parseInt(endTimeParts[0], 10);
                  const endMinute = parseInt(endTimeParts[1], 10);
                  
                  processedSlots.push({
                    dayOfWeek: slot.dayOfWeek,
                    startHour,
                    startMinute,
                    endHour,
                    endMinute,
                    userId: slot.user_id || userId,
                    userName: typeof userData === 'object' && 'name' in userData ? String(userData.name) : 'Unknown',
                    category: slot.category || 'General'
                  });
                }
              }
            });
          }
        });
      }
      
      setAvailabilitySlots(processedSlots);
    };
    
    processAvailabilities();
  }, [availabilities]);

  const openEventActions = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
  };

  return {
    selectedEvent,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    availabilitySlots,
    openEventActions,
    handleEdit,
    confirmDelete,
    clearSelectedEvent
  };
};
