
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/lead';
import { AlertTriangle } from 'lucide-react';

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);
      
      if (error) throw error;
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Lead
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the lead for <span className="font-medium">{lead.name}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-3">
          <div className="text-sm text-muted-foreground">
            <strong>Email:</strong> {lead.email}
          </div>
          {lead.phone && (
            <div className="text-sm text-muted-foreground">
              <strong>Phone:</strong> {lead.phone}
            </div>
          )}
          {lead.stage && (
            <div className="text-sm text-muted-foreground">
              <strong>Stage:</strong> {lead.stage}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Lead'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLeadDialog;
