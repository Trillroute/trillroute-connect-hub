
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserManagementUser } from '@/types/student';
import { Trash2, Pencil } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditFromView?: () => void;
  onDeleteUser?: () => void;
  canDeleteUser?: boolean;
}

const ViewUserDialog = ({ 
  user, 
  isOpen, 
  onOpenChange, 
  onEditFromView,
  onDeleteUser,
  canDeleteUser = false
}: ViewUserDialogProps) => {
  if (!user) return null;

  // Helper function to check if a field exists and is not empty
  const hasValue = (value: any) => value !== undefined && value !== null && value !== '';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View details for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(60vh-10rem)] pr-4">
          <div className="space-y-4 py-4">
            {/* Basic Information Section */}
            <div className="bg-muted rounded-md p-3">
              <h3 className="text-sm font-semibold mb-2 text-primary">Basic Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <strong className="text-sm">Full Name:</strong>
                  <p>{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <strong className="text-sm">Email:</strong>
                  <p className="break-all">{user.email}</p>
                </div>
                <div>
                  <strong className="text-sm">Role:</strong>
                  <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                </div>
                <div>
                  <strong className="text-sm">Created:</strong>
                  <p>{format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
                </div>
                {hasValue(user.dateOfBirth) && (
                  <div>
                    <strong className="text-sm">Date of Birth:</strong>
                    <p>{user.dateOfBirth}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            {(hasValue(user.primaryPhone) || hasValue(user.secondaryPhone) || hasValue(user.address)) && (
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2 text-primary">Contact Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hasValue(user.primaryPhone) && (
                    <div>
                      <strong className="text-sm">Primary Phone:</strong>
                      <p>{user.primaryPhone}</p>
                    </div>
                  )}
                  {hasValue(user.secondaryPhone) && (
                    <div>
                      <strong className="text-sm">Secondary Phone:</strong>
                      <p>{user.secondaryPhone}</p>
                    </div>
                  )}
                  {hasValue(user.whatsappEnabled) && (
                    <div>
                      <strong className="text-sm">WhatsApp Enabled:</strong>
                      <p>{user.whatsappEnabled ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                  {hasValue(user.address) && (
                    <div className="col-span-2">
                      <strong className="text-sm">Address:</strong>
                      <p>{user.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Student-specific information */}
            {user.role === 'student' && (hasValue(user.parentName) || hasValue(user.guardianRelation)) && (
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2 text-primary">Guardian Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hasValue(user.parentName) && (
                    <div>
                      <strong className="text-sm">Parent/Guardian Name:</strong>
                      <p>{user.parentName}</p>
                    </div>
                  )}
                  {hasValue(user.guardianRelation) && (
                    <div>
                      <strong className="text-sm">Guardian Relationship:</strong>
                      <p>{user.guardianRelation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin-specific information */}
            {user.role === 'admin' && hasValue(user.adminRoleName) && (
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2 text-primary">Admin Information</h3>
                <div>
                  <strong className="text-sm">Permission Level:</strong>
                  <p>{user.adminRoleName || "Standard"}</p>
                </div>
              </div>
            )}

            {/* Profile photo if available */}
            {hasValue(user.profilePhoto) && (
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2 text-primary">Profile Photo</h3>
                <div className="flex justify-center">
                  <img 
                    src={user.profilePhoto} 
                    alt={`${user.firstName}'s profile`} 
                    className="rounded-md max-h-48 object-contain"
                  />
                </div>
              </div>
            )}

            {/* ID Proof if available */}
            {hasValue(user.idProof) && (
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2 text-primary">ID Proof</h3>
                <div className="flex justify-center">
                  <img 
                    src={user.idProof} 
                    alt="ID Proof" 
                    className="rounded-md max-h-48 object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex space-x-2">
            {onEditFromView && (
              <Button variant="secondary" onClick={onEditFromView}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {onDeleteUser && canDeleteUser && (
              <Button 
                variant="destructive" 
                onClick={onDeleteUser}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
