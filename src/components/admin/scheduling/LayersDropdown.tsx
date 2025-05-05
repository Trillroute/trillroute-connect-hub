
import React, { useState, useEffect } from 'react';
import { Layers, Check, ChevronRight, Search, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { EventLayer, SelectedUser, useCalendar } from './CalendarContext';

// Import hooks for getting users
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { ScrollArea } from '@/components/ui/scroll-area';

const LayersDropdown: React.FC = () => {
  const { activeLayers, toggleLayer, selectedUsers, toggleUser } = useCalendar();
  const { teachers, loading: loadingTeachers } = useTeachers();
  const { students, loading: loadingStudents } = useStudents();
  
  // Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLayerForSearch, setActiveLayerForSearch] = useState<EventLayer | null>(null);

  const layers: { id: EventLayer; label: string; color: string; icon: React.ReactNode }[] = [
    { id: 'teachers', label: 'Teachers', color: 'bg-green-500', icon: <User className="h-4 w-4" /> },
    { id: 'students', label: 'Students', color: 'bg-blue-500', icon: <Users className="h-4 w-4" /> },
    { id: 'admins', label: 'Admins', color: 'bg-yellow-500', icon: <User className="h-4 w-4" /> },
    { id: 'superadmins', label: 'SuperAdmins', color: 'bg-purple-500', icon: <User className="h-4 w-4" /> },
  ];

  // Filter users based on layer and search query
  const getFilteredUsers = (layer: EventLayer) => {
    let users: { id: string; name: string }[] = [];

    switch (layer) {
      case 'teachers':
        users = teachers.map(teacher => ({
          id: teacher.id,
          name: `${teacher.first_name} ${teacher.last_name}`,
        }));
        break;
      case 'students':
        users = students.map(student => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
        }));
        break;
      case 'admins':
      case 'superadmins':
        // For now, we don't have a hook to get admins and superadmins
        // This would be implemented when those hooks are available
        users = [];
        break;
    }

    if (!searchQuery) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Check if a user is selected
  const isUserSelected = (userId: string) => {
    return selectedUsers.some(user => user.id === userId);
  };

  // Handle user toggle
  const handleUserToggle = (user: { id: string; name: string }, layer: EventLayer) => {
    toggleUser({
      id: user.id,
      name: user.name,
      layer
    });
  };

  // Reset search when dropdown closes
  const handleDropdownOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery('');
      setActiveLayerForSearch(null);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white">
          <Layers className="h-4 w-4" />
          <span className="hidden md:inline">Layers</span>
          {selectedUsers.length > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-xs text-white">
              {selectedUsers.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white" align="start">
        <DropdownMenuLabel>Event Layers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {layers.map((layer) => (
          <React.Fragment key={layer.id}>
            <DropdownMenuCheckboxItem
              checked={activeLayers.includes(layer.id)}
              onCheckedChange={() => toggleLayer(layer.id)}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${layer.color}`} />
              <span className="flex-1">{layer.label}</span>
              {activeLayers.includes(layer.id) && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="pl-0 py-0">
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-56 bg-white">
                    <div className="p-2">
                      <Input
                        placeholder={`Search ${layer.label.toLowerCase()}`}
                        value={activeLayerForSearch === layer.id ? searchQuery : ''}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setActiveLayerForSearch(layer.id);
                        }}
                        className="mb-2"
                        autoFocus
                      />
                    </div>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-[200px]">
                      {layer.id === 'teachers' && loadingTeachers ? (
                        <DropdownMenuItem disabled>Loading teachers...</DropdownMenuItem>
                      ) : layer.id === 'students' && loadingStudents ? (
                        <DropdownMenuItem disabled>Loading students...</DropdownMenuItem>
                      ) : (
                        getFilteredUsers(layer.id).map((user) => (
                          <DropdownMenuItem
                            key={user.id}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleUserToggle(user, layer.id)}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <div className={`w-2 h-2 rounded-full ${layer.color}`} />
                              <span>{user.name}</span>
                            </div>
                            {isUserSelected(user.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ))
                      )}
                      {getFilteredUsers(layer.id).length === 0 && !loadingTeachers && !loadingStudents && (
                        <DropdownMenuItem disabled>No users found</DropdownMenuItem>
                      )}
                    </ScrollArea>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            </DropdownMenuCheckboxItem>
          </React.Fragment>
        ))}
        
        {selectedUsers.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Selected Users ({selectedUsers.length})</DropdownMenuLabel>
            <ScrollArea className="h-[100px]">
              {selectedUsers.map((user) => {
                const layerInfo = layers.find(l => l.id === user.layer);
                return (
                  <DropdownMenuItem
                    key={user.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleUser(user)}
                  >
                    <div className={`w-2 h-2 rounded-full ${layerInfo?.color || 'bg-gray-300'}`} />
                    <span className="text-sm">{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUser(user);
                      }}
                    >
                      <span className="sr-only">Remove</span>
                      &times;
                    </Button>
                  </DropdownMenuItem>
                );
              })}
            </ScrollArea>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LayersDropdown;
