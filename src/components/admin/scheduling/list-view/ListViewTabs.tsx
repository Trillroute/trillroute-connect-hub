
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, ClipboardList } from 'lucide-react';

interface ListViewTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ListViewTabs: React.FC<ListViewTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full max-w-md">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          <span>All</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Events</span>
        </TabsTrigger>
        <TabsTrigger value="slots" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Slots</span>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Upcoming</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ListViewTabs;
