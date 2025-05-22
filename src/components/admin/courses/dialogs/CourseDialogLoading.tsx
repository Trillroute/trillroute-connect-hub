
import React from 'react';
import { Loader } from 'lucide-react';

const CourseDialogLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader className="h-8 w-8 animate-spin text-music-500" />
    </div>
  );
};

export default CourseDialogLoading;
