
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin' | 'superadmin';
  adminLevel?: number;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (userData: NewUserData) => void;
  isLoading: boolean;
  allowAdminCreation: boolean;
  defaultRole?: 'student' | 'teacher' | 'admin';
  title?: string;
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
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(defaultRole || 'student');
  const [adminLevel, setAdminLevel] = useState<number>(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddUser({
      firstName,
      lastName,
      email,
      password,
      role,
      ...(role === 'admin' ? { adminLevel } : {})
    });
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole(defaultRole || 'student');
    setAdminLevel(8);
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
              <Select value={role} onValueChange={(value: 'student' | 'teacher' | 'admin') => setRole(value)}>
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
              <Label htmlFor="adminLevel">Admin Permission Level</Label>
              <Select 
                value={adminLevel.toString()} 
                onValueChange={(value: string) => setAdminLevel(parseInt(value))}
              >
                <SelectTrigger id="adminLevel">
                  <SelectValue placeholder="Select admin level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Highest)</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                  <SelectItem value="5">Level 5</SelectItem>
                  <SelectItem value="6">Level 6</SelectItem>
                  <SelectItem value="8">Level 8 (Lowest)</SelectItem>
                </SelectContent>
              </Select>
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
