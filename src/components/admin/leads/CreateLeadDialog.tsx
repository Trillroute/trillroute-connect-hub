
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Create a new lead by filling out the information below.
          </DialogDescription>
        </DialogHeader>
        
        {/* Form will be implemented here */}
        <div className="py-4">
          <p className="text-center text-muted-foreground">Lead creation form coming soon</p>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Create Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;
