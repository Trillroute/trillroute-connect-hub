
import { useToast } from '@/hooks/use-toast';

export const useLeadToast = () => {
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
