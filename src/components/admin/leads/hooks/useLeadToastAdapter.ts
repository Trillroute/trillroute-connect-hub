
import { useToast } from '@/hooks/use-toast';

// This adapter helps fix the incompatibility between different toast implementations
export const useLeadToastAdapter = () => {
  const { toast } = useToast();
  
  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };
  
  return { showToast };
};
