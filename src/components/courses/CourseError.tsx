
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface CourseErrorProps {
  error: string;
  onBack: () => void;
  onRetry: () => void;
}

export const CourseError = ({ error, onBack, onRetry }: CourseErrorProps) => (
  <div className="container mx-auto px-4 py-8">
    <Button
      variant="ghost"
      onClick={onBack}
      className="mb-6"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Courses
    </Button>
    
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
    
    <div className="text-center mt-8">
      <Button onClick={onRetry}>
        Try Again
      </Button>
    </div>
  </div>
);
