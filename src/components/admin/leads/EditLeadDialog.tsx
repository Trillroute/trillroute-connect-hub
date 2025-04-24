
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lead, LeadChannel, LeadLocation, LeadStage } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MultiSelect } from '@/components/ui/multi-select';
import { useSkills } from '@/hooks/useSkills';

type EditLeadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSuccess: () => void;
};

const EditLeadDialog: React.FC<EditLeadDialogProps> = ({ 
  open, 
  onOpenChange, 
  lead, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { skills, loading: skillsLoading } = useSkills();
  const [courses, setCourses] = useState<{id: string, title: string}[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    secondary_phone: lead?.secondary_phone || '',
    whatsapp_enabled: lead?.whatsapp_enabled || false,
    age: lead?.age || '',
    location: lead?.location || '',
    channel: lead?.channel || '',
    remarks: lead?.remarks || '',
    lead_quality: lead?.lead_quality || 1,
    stage: lead?.stage || 'New',
    owner: lead?.owner || '',
    interested_courses: lead?.interested_courses || [],
    interested_skills: lead?.interested_skills || []
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const { data, error } = await supabase
          .from('courses')
          .select('id, title')
          .order('title');
          
        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          secondary_phone: formData.secondary_phone,
          whatsapp_enabled: formData.whatsapp_enabled,
          age: formData.age ? parseInt(formData.age.toString()) : null,
          location: formData.location,
          channel: formData.channel,
          remarks: formData.remarks,
          lead_quality: formData.lead_quality ? parseInt(formData.lead_quality.toString()) : null,
          stage: formData.stage,
          owner: formData.owner,
          interested_courses: formData.interested_courses,
          interested_skills: formData.interested_skills
        })
        .eq('id', lead.id);
      
      if (error) throw error;
      
      toast({
        title: 'Lead Updated',
        description: 'Lead information has been updated successfully.',
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(100vh-14rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  name="name"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="secondary_phone" className="text-sm font-medium">Secondary Phone</label>
                <input
                  id="secondary_phone"
                  name="secondary_phone"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.secondary_phone || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">WhatsApp Enabled</label>
                <Switch
                  checked={formData.whatsapp_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsapp_enabled: checked }))}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="age" className="text-sm font-medium">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <select
                  id="location"
                  name="location"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="">Select location</option>
                  <option value="Indiranagar">Indiranagar</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="channel" className="text-sm font-medium">Channel</label>
                <select
                  id="channel"
                  name="channel"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.channel}
                  onChange={handleChange}
                >
                  <option value="">Select channel</option>
                  {[
                    'Call', 'Wix', 'Walk-in', 'Whatsapp', 'Message',
                    'Google My Business', 'Instagram', 'Meta Ads', 'Facebook',
                    'Justdial', 'Urbanpro', 'Google form', 'Other',
                    'In Person', 'Referral', 'E-mail'
                  ].map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="lead_quality" className="text-sm font-medium">Lead Quality (1-5)</label>
                <input
                  id="lead_quality"
                  name="lead_quality"
                  type="number"
                  min="1"
                  max="5"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.lead_quality}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="stage" className="text-sm font-medium">Stage</label>
                <select
                  id="stage"
                  name="stage"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.stage}
                  onChange={handleChange}
                >
                  {[
                    'New', 'Contacted', 'Interested', 'Take admission',
                    'Converted', 'Lost'
                  ].map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="owner" className="text-sm font-medium">Owner</label>
                <input
                  id="owner"
                  name="owner"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.owner || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Interested Skills</label>
              <MultiSelect
                options={skills.map(skill => ({ label: skill.name, value: skill.name }))}
                selected={formData.interested_skills || []}
                onChange={(selected) => handleMultiSelectChange('interested_skills', selected)}
                placeholder={skillsLoading ? "Loading skills..." : "Select skills..."}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Interested Courses</label>
              <MultiSelect
                options={courses.map(course => ({ label: course.title, value: course.title }))}
                selected={formData.interested_courses || []}
                onChange={(selected) => handleMultiSelectChange('interested_courses', selected)}
                placeholder={loadingCourses ? "Loading courses..." : "Select courses..."}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="remarks" className="text-sm font-medium">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                className="px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                value={formData.remarks || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Lead'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
