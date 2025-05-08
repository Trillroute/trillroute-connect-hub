
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterTypeTabsProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
}

const FilterTypeTabs: React.FC<FilterTypeTabsProps> = ({
  filterType,
  setFilterType
}) => {
  return (
    <Tabs 
      defaultValue={filterType || "all"} 
      onValueChange={(value) => setFilterType(value === "all" ? null : value)}
    >
      <TabsList className="flex rounded-md bg-gray-100 p-1">
        <TabsTrigger value="all" className="flex-1 px-3 py-1.5 text-sm font-medium">All</TabsTrigger>
        <TabsTrigger value="teacher" className="flex-1 px-3 py-1.5 text-sm font-medium">Teachers</TabsTrigger>
        <TabsTrigger value="student" className="flex-1 px-3 py-1.5 text-sm font-medium">Students</TabsTrigger>
        <TabsTrigger value="admin" className="flex-1 px-3 py-1.5 text-sm font-medium">Admins</TabsTrigger>
        <TabsTrigger value="staff" className="flex-1 px-3 py-1.5 text-sm font-medium">Staff</TabsTrigger>
        <TabsTrigger value="course" className="flex-1 px-3 py-1.5 text-sm font-medium">Course</TabsTrigger>
        <TabsTrigger value="skill" className="flex-1 px-3 py-1.5 text-sm font-medium">Skill</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FilterTypeTabs;
