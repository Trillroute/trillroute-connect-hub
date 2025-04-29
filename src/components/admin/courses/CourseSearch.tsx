
import React from 'react';
import { Input } from '@/components/ui/input';

interface CourseSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="relative w-full mb-4">
      <Input
        type="search"
        placeholder="Search courses..."
        className="pl-9"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  );
};

export default CourseSearch;
