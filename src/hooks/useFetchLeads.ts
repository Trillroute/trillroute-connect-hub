
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lead } from '@/types/lead';

export const useFetchLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type-cast the data to match our Lead type
      const typedLeads = (data || []) as Lead[];
      setLeads(typedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load leads. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up a real-time subscription for lead updates
  useEffect(() => {
    fetchLeads();

    // Subscribe to changes on the leads table
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { leads, loading, fetchLeads };
};
