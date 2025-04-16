
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileHeader } from './ProfileHeader';
import { ProfileForm } from './ProfileForm';

export function UserProfile() {
  return (
    <Card className="w-full">
      <ProfileHeader />
      <CardContent>
        <ProfileForm />
      </CardContent>
    </Card>
  );
}
