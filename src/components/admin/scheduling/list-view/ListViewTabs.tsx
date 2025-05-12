
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List } from 'lucide-react';

interface ListViewTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ListViewTabs: React.FC<ListViewTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          All
        </TabsTrigger>
        <TabsTrigger value="events">
          <Calendar className="h-4 w-4 mr-2" />
          Events
        </TabsTrigger>
        <TabsTrigger value="slots">
          <List className="h-4 w-4 mr-2" />
          Slots
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ListViewTabs;
