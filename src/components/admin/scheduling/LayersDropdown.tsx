
import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { EventLayer, useCalendar } from './CalendarContext';

const LayersDropdown: React.FC = () => {
  const { activeLayers, toggleLayer } = useCalendar();

  const layers: { id: EventLayer; label: string; color: string }[] = [
    { id: 'teachers', label: 'Teachers', color: 'bg-green-500' },
    { id: 'students', label: 'Students', color: 'bg-blue-500' },
    { id: 'admins', label: 'Admins', color: 'bg-yellow-500' },
    { id: 'superadmins', label: 'SuperAdmins', color: 'bg-purple-500' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white">
          <Layers className="h-4 w-4" />
          <span className="hidden md:inline">Layers</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="start">
        <DropdownMenuLabel>Event Layers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {layers.map((layer) => (
          <DropdownMenuCheckboxItem
            key={layer.id}
            checked={activeLayers.includes(layer.id)}
            onCheckedChange={() => toggleLayer(layer.id)}
            className="flex items-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${layer.color}`} />
            <span>{layer.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LayersDropdown;
