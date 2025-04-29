
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
        className="pl-10 h-10"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default CourseSearch;
