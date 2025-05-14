import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, EventLayer, SelectedUser } from './calendarTypes';

export function useCalendarFilters(setEvents: (events: CalendarEvent[]) => void) {
  // Initialize with all layers active
  const [activeLayers, setActiveLayers] = useState<EventLayer[]>(['teachers', 'students', 'admins', 'superadmins']);
  
  // Initialize selectedUsers state
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  
  // Toggle a specific layer on/off
  const toggleLayer = (layer: EventLayer) => {
    setActiveLayers(prev => 
      prev.includes(layer)
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
    
    // If layer is turned off, remove all users from that layer
    if (activeLayers.includes(layer)) {
      setSelectedUsers(prev => prev.filter(user => user.layer !== layer));
    }
  };
  
  // Toggle a specific user on/off
  const toggleUser = (user: SelectedUser) => {
    setSelectedUsers(prev => {
      const userExists = prev.some(u => u.id === user.id);
      
      if (userExists) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };
  
  // Filter events by role
  const filterEventsByRole = async (roles: string[]) => {
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select(`
          *,
          custom_users!user_id (first_name, last_name, role)
        `);
        
      if (error) {
        console.error("Error fetching events by role:", error);
        return;
      }
      
      // Filter events by user role
      const filteredEvents = data.filter(event => {
        const userRole = event.custom_users?.role;
        return userRole && roles.includes(userRole);
      });
      
      // Map to calendar events format
      const mappedEvents = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        description: event.description,
        color: event.custom_users?.role === 'teacher' ? '#4f46e5' : 
               event.custom_users?.role === 'admin' ? '#0891b2' : 
               event.custom_users?.role === 'student' ? '#16a34a' : 
               event.custom_users?.role === 'superadmin' ? '#9333ea' : '#6b7280',
      }));
      
      setEvents(mappedEvents);
      
    } catch (err) {
      console.error("Failed to filter events by role:", err);
    }
  };
  
  // Filter events by user ID
  // Keep this as a separate exported function that takes a string ID
  const filterEventsByUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error fetching events for user:", error);
        return;
      }
      
      // Map to calendar events format
      const mappedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        description: event.description,
      }));
      
      setEvents(mappedEvents);
      
    } catch (err) {
      console.error("Failed to filter events by user:", err);
    }
  };

  return {
    activeLayers,
    selectedUsers,
    setActiveLayers,
    setSelectedUsers,
    toggleLayer,
    toggleUser,
    filterEventsByRole,
    filterEventsByUser
  };
}
