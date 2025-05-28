
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CourseForm, { CourseFormValues } from '../CourseForm';
import { Teacher } from '@/types/course';
import { UseFormReturn } from 'react-hook-form';

interface EditCourseDialogContentProps {
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (data: CourseFormValues) => void;
  teachers: Teacher[];
  skills: { id: string; name: string }[];
  isLoading: boolean;
  onClose: () => void;
}

const EditCourseDialogContent: React.FC<EditCourseDialogContentProps> = ({
  form,
  onSubmit,
  teachers,
  skills,
  isLoading,
  onClose
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-music-500"></div>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogDescription>
          Update the course information below.
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[calc(100vh-14rem)] pr-4">
        <CourseForm 
          form={form} 
          onSubmit={onSubmit} 
          teachers={teachers}
          skills={skills}
          submitButtonText="Update Course"
          cancelAction={onClose}
        />
      </ScrollArea>
    </>
  );
};

export default EditCourseDialogContent;
