
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CourseFormTabs: React.FC = () => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="basic">Basic Info</TabsTrigger>
      <TabsTrigger value="duration">Duration</TabsTrigger>
      <TabsTrigger value="pricing">Pricing</TabsTrigger>
      <TabsTrigger value="discount">Discount</TabsTrigger>
    </TabsList>
  );
};

export default CourseFormTabs;
