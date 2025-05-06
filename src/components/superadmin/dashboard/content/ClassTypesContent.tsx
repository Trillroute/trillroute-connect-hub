
import React from 'react';
import ContentWrapper from './ContentWrapper';
import ClassTypeManagement from '@/components/admin/class-types/ClassTypeManagement';

const ClassTypesContent: React.FC = () => {
  return (
    <ContentWrapper 
      title="Class Types"
      description="Manage different types of classes"
    >
      <ClassTypeManagement />
    </ContentWrapper>
  );
};

export default ClassTypesContent;
