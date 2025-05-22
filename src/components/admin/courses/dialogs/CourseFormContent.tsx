
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs } from '@/components/ui/tabs';
import CourseFormTabs from './CourseFormTabs';
import CourseForm from '../CourseForm';
import { Teacher } from '@/types/course';
import { UseFormReturn } from 'react-hook-form';
import { CourseFormValues } from '../CourseForm';
import CourseDialogLoading from './CourseDialogLoading';

interface CourseFormContentProps {
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (values: CourseFormValues) => void;
  teachers: Teacher[];
  skills: { id: string; name: string }[];
  isLoading: boolean;
  cancelAction: () => void;
  submitButtonText?: string;
}

const CourseFormContent: React.FC<CourseFormContentProps> = ({
  form,
  onSubmit,
  teachers,
  skills,
  isLoading,
  cancelAction,
  submitButtonText = "Create Course"
}) => {
  if (isLoading) {
    return <CourseDialogLoading />;
  }
  
  return (
    <ScrollArea className="max-h-[calc(100vh-8rem)]">
      <div className="p-6 pt-2">
        <Tabs defaultValue="basic" className="w-full">
          <CourseFormTabs />
          <CourseForm 
            form={form} 
            onSubmit={onSubmit} 
            teachers={teachers}
            skills={skills}
            submitButtonText={submitButtonText}
            cancelAction={cancelAction}
          />
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default CourseFormContent;
