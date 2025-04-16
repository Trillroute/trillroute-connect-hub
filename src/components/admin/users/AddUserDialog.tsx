
import React, { useState } from 'react';
import { UserRole } from '@/hooks/useAuth';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (userData: NewUserData) => Promise<void>;
  isLoading: boolean;
  allowAdminCreation?: boolean;
}

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  dateOfBirth: string;
  profilePhoto: string;
  parentName: string;
  guardianRelation: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappEnabled: boolean;
  address: string;
  idProof: string;
}

const initialUserData: NewUserData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'student',
  dateOfBirth: '',
  profilePhoto: '',
  parentName: '',
  guardianRelation: '',
  primaryPhone: '',
  secondaryPhone: '',
  whatsappEnabled: false,
  address: '',
  idProof: ''
};

const AddUserDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddUser, 
  isLoading,
  allowAdminCreation = false
}: AddUserDialogProps) => {
  const [userData, setUserData] = useState<NewUserData>(initialUserData);

  const handleSubmit = async () => {
    await onAddUser(userData);
    setUserData(initialUserData); // Reset form after submission
  };

  const handleRoleChange = (value: UserRole) => {
    setUserData({ 
      ...userData, 
      role: value,
      // Clear guardian fields if not student
      guardianRelation: value === 'student' ? userData.guardianRelation : '',
      parentName: value === 'student' ? userData.parentName : ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user.
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
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={userData.role} 
                    onValueChange={(value: UserRole) => handleRoleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      {allowAdminCreation && <SelectItem value="admin">Administrator</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={userData.dateOfBirth}
                    onChange={(e) =>
                      setUserData({ ...userData, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                {userData.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input
                      id="parentName"
                      value={userData.parentName}
                      onChange={(e) =>
                        setUserData({ ...userData, parentName: e.target.value })
                      }
                    />
                  </div>
                )}
                {userData.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="guardianRelation">Guardian Relation</Label>
                    <Input
                      id="guardianRelation"
                      value={userData.guardianRelation}
                      onChange={(e) =>
                        setUserData({ ...userData, guardianRelation: e.target.value })
                      }
                      placeholder="e.g. Father, Mother, Guardian"
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryPhone">Primary Phone</Label>
                  <Input
                    id="primaryPhone"
                    value={userData.primaryPhone}
                    onChange={(e) =>
                      setUserData({ ...userData, primaryPhone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input
                    id="secondaryPhone"
                    value={userData.secondaryPhone}
                    onChange={(e) =>
                      setUserData({ ...userData, secondaryPhone: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="whatsapp"
                    checked={userData.whatsappEnabled}
                    onCheckedChange={(checked) =>
                      setUserData({ ...userData, whatsappEnabled: checked })
                    }
                  />
                  <Label htmlFor="whatsapp">WhatsApp enabled on primary phone</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={userData.address}
                    onChange={(e) =>
                      setUserData({ ...userData, address: e.target.value })
                    }
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Profile Photo URL</Label>
                  <Input
                    id="profilePhoto"
                    value={userData.profilePhoto}
                    onChange={(e) =>
                      setUserData({ ...userData, profilePhoto: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof URL</Label>
                  <Input
                    id="idProof"
                    value={userData.idProof}
                    onChange={(e) =>
                      setUserData({ ...userData, idProof: e.target.value })
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
