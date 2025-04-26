
import { Button } from '@/components/ui/button';

export const CourseNotFound = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
    <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
    <Button onClick={() => window.history.back()}>Go Back</Button>
  </div>
);
