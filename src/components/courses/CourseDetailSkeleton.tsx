
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export const CourseDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-10 w-32 bg-gray-200 rounded mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div className="md:col-span-2">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-20 bg-gray-200 rounded mb-4" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="h-48 md:h-64 bg-gray-200 rounded" />
    </div>
  </div>
);
