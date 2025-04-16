
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Lead } from '@/types/lead';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Placeholder for editing a lead */}
      Edit Lead Dialog
    </Dialog>
  );
};

export default EditLeadDialog;
