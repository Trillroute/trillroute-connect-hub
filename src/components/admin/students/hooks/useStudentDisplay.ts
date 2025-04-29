
import { useState } from 'react';

export const useStudentDisplay = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');

  return {
    selectedStudents,
    setSelectedStudents,
    viewMode,
    setViewMode
  };
};
