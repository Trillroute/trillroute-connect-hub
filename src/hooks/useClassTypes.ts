
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ClassType {
  id: string;
  name: string;
  price_inr: number;
  max_students: number;
  duration_value: number;
  duration_metric: string;
  created_at: string;
  image?: string | null;
  location?: string;
  description: string;
}

export const useClassTypes = () => {
  const { data: classTypes = [], isLoading, error } = useQuery({
    queryKey: ['classTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as ClassType[];
    },
  });

  return {
    classTypes,
    isLoading,
    error,
  };
};
