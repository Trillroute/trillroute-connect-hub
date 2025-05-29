
import { CalendarEvent } from '../types';

/**
 * Gets the color for an event based on its type, matching EventColorPicker colors
 */
export const getEventColor = (event: CalendarEvent) => {
  // Check if it's an availability slot
  if (event.eventType === 'availability') {
    return '#6B7280'; // Gray for availability slots
  }

  // Check if it's a trial class
  const isTrialClass = event.title?.toLowerCase().includes('trial') || 
                      event.description?.toLowerCase().includes('trial') ||
                      event.eventType?.toLowerCase().includes('trial');
  
  if (isTrialClass) {
    return '#F97316'; // Orange for trial classes - matches EventColorPicker
  }

  // Check event type for other categories - matches EventColorPicker exactly
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
      return '#10B981'; // Green for regular sessions - matches EventColorPicker
  }
};

/**
 * Gets the background class for event badges based on event type
 */
export const getEventTypeBackgroundClass = (event: CalendarEvent) => {
  // Check if it's an availability slot
  if (event.eventType === 'availability') {
    return 'bg-gray-100 border-gray-300 text-gray-800';
  }

  // Check if it's a trial class
  const isTrialClass = event.title?.toLowerCase().includes('trial') || 
                      event.description?.toLowerCase().includes('trial') ||
                      event.eventType?.toLowerCase().includes('trial');
  
  if (isTrialClass) {
    return 'bg-orange-100 border-orange-300 text-orange-800';
  }

  // Check event type for other categories - matches other views exactly
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

/**
 * Checks if an event is an availability slot
 */
export const isAvailabilitySlot = (event: CalendarEvent) => {
  return event.eventType === 'availability' || event.metadata?.isAvailability;
};
