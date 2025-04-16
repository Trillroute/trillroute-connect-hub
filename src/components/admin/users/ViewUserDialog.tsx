
import React from 'react';
import { format } from 'date-fns';
import { UserManagementUser } from '@/types/student';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface ViewUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewUserDialog = ({ user, isOpen, onOpenChange }: ViewUserDialogProps) => {
  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="py-4 pr-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="pt-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold block">First Name:</span>
                      <span>{user.firstName}</span>
                    </div>
                    <div>
                      <span className="font-semibold block">Last Name:</span>
                      <span>{user.lastName}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Role:</span>
                    <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Date of Birth:</span>
                    <span>{user.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Parent/Guardian Name:</span>
                    <span>{user.parentName || 'Not provided'}</span>
                  </div>
                  {user.role === 'student' && (
                    <div>
                      <span className="font-semibold block">Guardian Relation:</span>
                      <span>{user.guardianRelation || 'Not provided'}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold block">Created:</span>
                    <span>{format(new Date(user.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="pt-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block">Primary Phone:</span>
                    <span>{user.primaryPhone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Secondary Phone:</span>
                    <span>{user.secondaryPhone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">WhatsApp Enabled:</span>
                    <span>{user.whatsappEnabled ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Address:</span>
                    <span>{user.address || 'Not provided'}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="pt-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block">Profile Photo:</span>
                    {user.profilePhoto ? (
                      <div className="mt-2">
                        <img 
                          src={user.profilePhoto} 
                          alt="Profile" 
                          className="w-32 h-32 object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <span>No profile photo</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold block">ID Proof:</span>
                    <span>{user.idProof || 'Not provided'}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
