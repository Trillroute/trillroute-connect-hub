
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CourseDialogHeaderProps {
  title: string;
  description?: string;
}

const CourseDialogHeader: React.FC<CourseDialogHeaderProps> = ({ 
  title, 
  description = "Fill in the course details below. All fields marked with * are required." 
}) => {
  return (
    <DialogHeader className="p-6 pb-0">
      <DialogTitle className="text-2xl font-bold text-music-600">{title}</DialogTitle>
      <DialogDescription className="text-muted-foreground mt-2">
        {description}
      </DialogDescription>
    </DialogHeader>
  );
};

export default CourseDialogHeader;
