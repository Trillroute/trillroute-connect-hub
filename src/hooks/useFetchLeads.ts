
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
      
      console.log('Raw lead data from database:', data);
      
      // Map the database response to match our Lead type
      const typedLeads = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        // Map status to stage if stage doesn't exist (for backwards compatibility)
        stage: item.stage || item.status || 'New' as Lead['stage'],
        // Add the new fields, with fallbacks for any missing data
        secondary_phone: item.secondary_phone || null,
        whatsapp_enabled: item.whatsapp_enabled || false,
        age: item.age || null,
        location: (item.location as Lead['location']) || null,
        channel: (item.channel as Lead['channel']) || null,
        remarks: item.remarks || null,
        lead_quality: item.lead_quality || null,
        owner: item.owner || null,
        interested_courses: item.interested_courses || null,
        interested_skills: item.interested_skills || null,
        source: item.source || null,
        created_at: item.created_at,
        user_id: item.user_id
      })) as Lead[];
      
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

    // Subscribe to changes on the leads table for ALL events (insert, update, delete)
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          
          // Immediately fetch the updated data
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
