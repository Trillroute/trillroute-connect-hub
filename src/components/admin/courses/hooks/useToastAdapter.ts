
import { useToast } from '@/hooks/use-toast';

// Create an adapter to fix toast call patterns
export const useToastAdapter = () => {
  const { toast } = useToast();
  
  const showToast = (title: string, description: string, variant?: 'default' | 'destructive') => {
    toast({
      title,
      description,
      variant: variant || 'default'
    });
  };
  
  return { showToast };
};
