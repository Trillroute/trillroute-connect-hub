
import { useState } from 'react';
import { EventLayer, SelectedUser } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';

export const useLayersDropdown = () => {
  // Ensure activeLayers and selectedUsers are always arrays
  const { 
    activeLayers = [], 
    toggleLayer, 
    selectedUsers = [], 
    toggleUser 
  } = useCalendar();
  
  const { teachers = [], loading: loadingTeachers } = useTeachers();
  const { students = [], loading: loadingStudents } = useStudents();

  // Define layer configurations
  const layers = [
    { id: 'teachers' as EventLayer, label: 'Teachers', color: 'bg-green-500', icon: null },
    { id: 'students' as EventLayer, label: 'Students', color: 'bg-blue-500', icon: null },
    { id: 'admins' as EventLayer, label: 'Admins', color: 'bg-yellow-500', icon: null },
    { id: 'superadmins' as EventLayer, label: 'SuperAdmins', color: 'bg-purple-500', icon: null },
  ];

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLayerForSearch, setActiveLayerForSearch] = useState<EventLayer | null>(null);

  // Filter users based on layer and search query
  const getFilteredUsers = (layer: EventLayer) => {
    let users: { id: string; name: string }[] = [];

    switch (layer) {
      case 'teachers':
        users = Array.isArray(teachers) ? teachers.map(teacher => ({
          id: teacher.id,
          name: `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Unnamed Teacher',
        })) : [];
        break;
      case 'students':
        users = Array.isArray(students) ? students.map(student => ({
          id: student.id,
          name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed Student',
        })) : [];
        break;
      case 'admins':
      case 'superadmins':
        // For now, we don't have a hook to get admins and superadmins
        users = [];
        break;
    }

    return users;
  };

  // Check if a user is selected
  const isUserSelected = (userId: string) => {
    return Array.isArray(selectedUsers) && selectedUsers.some(user => user.id === userId);
  };

  // Handle user toggle
  const handleUserToggle = (user: { id: string; name: string }, layer: EventLayer) => {
    toggleUser({
      id: user.id,
      name: user.name,
      layer
    });
  };

  // Get color for a layer
  const getLevelColor = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    return layer?.color || 'bg-gray-300';
  };

  // Reset search when dropdown closes
  const handleDropdownOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery('');
      setActiveLayerForSearch(null);
    }
  };

  return {
    layers,
    activeLayers,
    selectedUsers,
    searchQuery,
    activeLayerForSearch,
    loadingTeachers,
    loadingStudents,
    toggleLayer,
    toggleUser,
    setSearchQuery,
    setActiveLayerForSearch,
    getFilteredUsers,
    isUserSelected,
    handleUserToggle,
    getLevelColor,
    handleDropdownOpenChange,
  };
};
