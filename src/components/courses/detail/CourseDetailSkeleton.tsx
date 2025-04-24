
import { Skeleton } from "@/components/ui/skeleton";

export const CourseDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
    <div className="flex items-center mb-8">
      <Skeleton className="h-10 w-40" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);
