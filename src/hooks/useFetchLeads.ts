
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lead } from '@/types/lead';
import { Database } from '@/integrations/supabase/types';

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
      
      console.log('Raw lead data from database:', data);
      
      // Ensure data is an array before mapping
      const typedLeads = (Array.isArray(data) ? data : []).map(item => {
        if (!item) return null;
        
        return {
          id: item.id,
          name: item.name || '',
          email: item.email || '',
          phone: item.phone || null,
          stage: (item.stage || item.status || 'New') as Lead['stage'],
          secondary_phone: item.secondary_phone || null,
          whatsapp_enabled: Boolean(item.whatsapp_enabled) || false,
          age: item.age || null,
          location: (item.location as Lead['location']) || null,
          channel: (item.channel as Lead['channel']) || null,
          remarks: item.remarks || null,
          lead_quality: item.lead_quality || null,
          owner: item.owner || null,
          interested_courses: Array.isArray(item.interested_courses) ? item.interested_courses : [],
          interested_skills: Array.isArray(item.interested_skills) ? item.interested_skills : [],
          source: item.source || null,
          created_at: item.created_at || new Date().toISOString(),
          user_id: item.user_id
        };
      }).filter(Boolean) as Lead[]; // Remove any null values
      
      setLeads(typedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load leads. Please try again.",
      });
      // Set empty array on error to avoid undefined
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Set up a real-time subscription for lead updates
  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        (payload) => {
          console.log('Realtime update received:', payload);
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
