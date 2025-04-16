import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { UserManagementUser } from '@/types/student';
import { hashPassword } from '@/integrations/supabase/client';
import { 
  PlusCircle, 
  UserPlus, 
  UserX, 
  Trash2, 
  RefreshCw,
  BadgeCheck,
  UserCog,
  Eye
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const UserManagement = () => {
  const [users, setUsers] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserManagementUser | null>(null);
  const [userToView, setUserToView] = useState<UserManagementUser | null>(null);
  const [newUserData, setNewUserData] = useState({
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
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('custom_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedUsers = data.map((user) => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        dateOfBirth: user.date_of_birth,
        profilePhoto: user.profile_photo,
        parentName: user.parent_name,
        guardianRelation: user.guardian_relation,
        primaryPhone: user.primary_phone,
        secondaryPhone: user.secondary_phone,
        whatsappEnabled: user.whatsapp_enabled,
        address: user.address,
        idProof: user.id_proof
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      if (!newUserData.firstName || !newUserData.lastName || !newUserData.email || !newUserData.password) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      setIsLoading(true);
      
      const passwordHash = await hashPassword(newUserData.password);
      
      const userId = crypto.randomUUID();
      
      const userData = {
        id: userId,
        email: newUserData.email.toLowerCase(),
        password_hash: passwordHash,
        first_name: newUserData.firstName,
        last_name: newUserData.lastName,
        role: newUserData.role,
        created_at: new Date().toISOString(),
        date_of_birth: newUserData.dateOfBirth,
        profile_photo: newUserData.profilePhoto,
        parent_name: newUserData.parentName,
        guardian_relation: newUserData.role === 'student' ? newUserData.guardianRelation : null,
        primary_phone: newUserData.primaryPhone,
        secondary_phone: newUserData.secondaryPhone,
        whatsapp_enabled: newUserData.whatsappEnabled,
        address: newUserData.address,
        id_proof: newUserData.idProof
      };
      
      const { error: userError } = await supabase
        .from('custom_users')
        .insert(userData);

      if (userError) {
        throw userError;
      }

      toast({
        title: 'Success',
        description: `${newUserData.role.charAt(0).toUpperCase() + newUserData.role.slice(1)} added successfully.`,
      });
      
      setNewUserData({
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
      });
      setIsAddDialogOpen(false);
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('custom_users')
        .delete()
        .eq('id', userToDelete.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `${userToDelete.role.charAt(0).toUpperCase() + userToDelete.role.slice(1)} removed successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (user: UserManagementUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (user: UserManagementUser) => {
    setUserToView(user);
    setIsViewDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage students and teachers</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchUsers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
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
                              value={newUserData.firstName}
                              onChange={(e) =>
                                setNewUserData({ ...newUserData, firstName: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={newUserData.lastName}
                              onChange={(e) =>
                                setNewUserData({ ...newUserData, lastName: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUserData.email}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, email: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUserData.password}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, password: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select 
                            value={newUserData.role} 
                            onValueChange={(value) => {
                              setNewUserData({ 
                                ...newUserData, 
                                role: value,
                                guardianRelation: value === 'student' ? newUserData.guardianRelation : ''
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={newUserData.dateOfBirth}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, dateOfBirth: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Parent/Guardian Name</Label>
                          <Input
                            id="parentName"
                            value={newUserData.parentName}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, parentName: e.target.value })
                            }
                          />
                        </div>
                        {newUserData.role === 'student' && (
                          <div className="space-y-2">
                            <Label htmlFor="guardianRelation">Guardian Relation</Label>
                            <Input
                              id="guardianRelation"
                              value={newUserData.guardianRelation}
                              onChange={(e) =>
                                setNewUserData({ ...newUserData, guardianRelation: e.target.value })
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
                            value={newUserData.primaryPhone}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, primaryPhone: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                          <Input
                            id="secondaryPhone"
                            value={newUserData.secondaryPhone}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, secondaryPhone: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="whatsapp"
                            checked={newUserData.whatsappEnabled}
                            onCheckedChange={(checked) =>
                              setNewUserData({ ...newUserData, whatsappEnabled: checked })
                            }
                          />
                          <Label htmlFor="whatsapp">WhatsApp enabled on primary phone</Label>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={newUserData.address}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, address: e.target.value })
                            }
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="documents" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="profilePhoto">Profile Photo URL</Label>
                          <Input
                            id="profilePhoto"
                            value={newUserData.profilePhoto}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, profilePhoto: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idProof">ID Proof URL</Label>
                          <Input
                            id="idProof"
                            value={newUserData.idProof}
                            onChange={(e) =>
                              setNewUserData({ ...newUserData, idProof: e.target.value })
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
                    onClick={handleAddUser} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add User'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-8 text-center text-gray-500">Loading users...</div>}
        
        {!isLoading && users.length === 0 && (
          <div className="py-8 text-center text-gray-500">No users found.</div>
        )}
        
        {!isLoading && users.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {`${user.firstName} ${user.lastName}`}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <BadgeCheck className="h-4 w-4 text-music-500 mr-1" />
                      ) : user.role === 'teacher' ? (
                        <UserCog className="h-4 w-4 text-music-400 mr-1" />
                      ) : (
                        <UserPlus className="h-4 w-4 text-music-300 mr-1" />
                      )}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewDialog(user)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      {user.role !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this {userToDelete?.role}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {userToDelete && (
                <div className="bg-muted p-3 rounded">
                  <p><strong>Name:</strong> {`${userToDelete.firstName} ${userToDelete.lastName}`}</p>
                  <p><strong>Email:</strong> {userToDelete.email}</p>
                  <p><strong>Role:</strong> {userToDelete.role}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser} 
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information for {userToView?.firstName} {userToView?.lastName}
              </DialogDescription>
            </DialogHeader>
            {userToView && (
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
                            <span>{userToView.firstName}</span>
                          </div>
                          <div>
                            <span className="font-semibold block">Last Name:</span>
                            <span>{userToView.lastName}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold block">Email:</span>
                          <span>{userToView.email}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Role:</span>
                          <span>{userToView.role.charAt(0).toUpperCase() + userToView.role.slice(1)}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Date of Birth:</span>
                          <span>{userToView.dateOfBirth || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Parent/Guardian Name:</span>
                          <span>{userToView.parentName || 'Not provided'}</span>
                        </div>
                        {userToView.role === 'student' && (
                          <div>
                            <span className="font-semibold block">Guardian Relation:</span>
                            <span>{userToView.guardianRelation || 'Not provided'}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold block">Created:</span>
                          <span>{format(new Date(userToView.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contact" className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold block">Primary Phone:</span>
                          <span>{userToView.primaryPhone || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Secondary Phone:</span>
                          <span>{userToView.secondaryPhone || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">WhatsApp Enabled:</span>
                          <span>{userToView.whatsappEnabled ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Address:</span>
                          <span>{userToView.address || 'Not provided'}</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="documents" className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold block">Profile Photo:</span>
                          {userToView.profilePhoto ? (
                            <div className="mt-2">
                              <img 
                                src={userToView.profilePhoto} 
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
                          <span>{userToView.idProof || 'Not provided'}</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            )}
            <DialogFooter>
              <Button 
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
