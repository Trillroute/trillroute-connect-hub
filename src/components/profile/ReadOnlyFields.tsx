
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ReadOnlyFields() {
  const { user } = useAuth();
  
  return (
    <>
      <div className="space-y-2">
        <Label>First Name</Label>
        <Input 
          value={user?.firstName || ''} 
          disabled 
          className="bg-gray-50"
        />
      </div>
      <div className="space-y-2">
        <Label>Last Name</Label>
        <Input 
          value={user?.lastName || ''} 
          disabled 
          className="bg-gray-50"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Email</Label>
        <Input 
          value={user?.email || ''} 
          disabled 
          className="bg-gray-50"
        />
      </div>
    </>
  );
}
