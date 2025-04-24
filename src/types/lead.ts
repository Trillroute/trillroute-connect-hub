
export type LeadChannel = 
  | 'Call' | 'Wix' | 'Walk-in' | 'Whatsapp' | 'Message' 
  | 'Google My Business' | 'Instagram' | 'Meta Ads' | 'Facebook'
  | 'Justdial' | 'Urbanpro' | 'Google form' | 'Other' 
  | 'In Person' | 'Referral' | 'E-mail';

export type LeadStage = 'New' | 'Contacted' | 'Interested' | 'Take admission' | 'Converted' | 'Lost';

export type LeadLocation = 'Indiranagar' | 'Online';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  secondary_phone: string | null;
  whatsapp_enabled: boolean;
  age: number | null;
  location: LeadLocation | null;
  channel: LeadChannel | null;
  remarks: string | null;
  lead_quality: number | null;
  stage: LeadStage;
  owner: string | null;
  interested_courses: string[] | null;
  interested_skills: string[] | null;
  source: string | null;
  created_at: string;
  user_id?: string | null;
};

