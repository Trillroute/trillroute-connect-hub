import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type UserRole = 'admin' | 'student' | 'teacher' | 'superadmin';

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  adminLevelName?: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  parentName?: string;
  guardianRelation?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  whatsappEnabled?: boolean;
  address?: string;
  idProof?: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (userData: NewUserData) => void;
  isLoading: boolean;
  allowAdminCreation?: boolean;
  defaultRole?: UserRole;
}

const AddUserDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddUser, 
  isLoading,
  allowAdminCreation,
  defaultRole,
  title = 'Add User'
}: AddUserDialogProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole || 'student');
  const [adminLevelName, setAdminLevelName] = useState<string>('Limited View');
  const [adminLevels, setAdminLevels] = useState<{name: string, description: string}[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  useEffect(() => {
    if (isOpen && (role === 'admin' || defaultRole === 'admin')) {
      loadAdminLevels();
    }
  }, [isOpen, role, defaultRole]);

  const loadAdminLevels = async () => {
    try {
      setIsLoadingLevels(true);
      const { data, error } = await supabase
        .from('admin_levels')
        .select('name, description')
        .order('id', { ascending: true });
        
      if (error) {
        console.error('Error loading admin levels:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setAdminLevels(data);
        setAdminLevelName(data[0].name); // Select the first level by default
      } else {
        // Fallback default levels
        setAdminLevels([
          { name: 'Limited View', description: 'View-only administrator' },
          { name: 'Standard Admin', description: 'Regular administrator permissions' },
          { name: 'Full Access', description: 'Complete administrative access' }
        ]);
      }
    } catch (error) {
      console.error('Error loading admin levels:', error);
    } finally {
      setIsLoadingLevels(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddUser({
      firstName,
      lastName,
      email,
      password,
      role,
      ...(role === 'admin' ? { adminLevelName } : {})
    });
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole(defaultRole || 'student');
    setAdminLevelName('Limited View');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter the details for the new user. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          {!defaultRole && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  {allowAdminCreation && (
                    <SelectItem value="admin">Administrator</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {(role === 'admin' && allowAdminCreation) && (
            <div className="space-y-2">
              <Label htmlFor="adminLevelName">Admin Permission Level</Label>
              <Select 
                value={adminLevelName} 
                onValueChange={(value: string) => setAdminLevelName(value)}
                disabled={isLoadingLevels}
              >
                <SelectTrigger id="adminLevelName">
                  <SelectValue placeholder={isLoadingLevels ? "Loading..." : "Select admin level"} />
                </SelectTrigger>
                <SelectContent>
                  {adminLevels.map(level => (
                    <SelectItem key={level.name} value={level.name}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingLevels && (
                <div className="text-xs text-muted-foreground mt-1">Loading admin levels...</div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
