
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Lead } from '@/types/lead';

type DeleteLeadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSuccess: () => void;
};

const DeleteLeadDialog: React.FC<DeleteLeadDialogProps> = ({ 
  open, 
  onOpenChange, 
  lead, 
  onSuccess 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Placeholder for deleting a lead */}
      Delete Lead Dialog
    </Dialog>
  );
};

export default DeleteLeadDialog;
