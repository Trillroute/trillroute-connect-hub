
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | string | null;
  source: string | null;
  created_at: string;
  user_id?: string | null;
  notes?: string | null; 
};
