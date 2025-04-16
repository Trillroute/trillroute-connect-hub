
import React from 'react';
import { Dialog } from '@/components/ui/dialog';

type CreateLeadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const CreateLeadDialog: React.FC<CreateLeadDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Placeholder for creating a new lead */}
      Create Lead Dialog
    </Dialog>
  );
};

export default CreateLeadDialog;
