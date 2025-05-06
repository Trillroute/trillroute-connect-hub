
import { useToast } from '@/hooks/use-toast';

// Create a specific adapter for course management components
export const useCourseToastAdapter = () => {
  const { toast } = useToast();
  
  // Correct toast function that handles the object pattern required
  const showToast = (title: string, description: string, variant?: 'default' | 'destructive') => {
    toast({
      title,
      description,
      variant: variant || 'default'
    });
  };
  
  return { showToast };
};
