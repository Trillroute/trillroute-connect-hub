
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LimitedAccessCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Limited Access</CardTitle>
        <CardDescription>
          You don't have permissions to access any admin sections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Please contact a super administrator to update your permissions.</p>
      </CardContent>
    </Card>
  );
};

export default LimitedAccessCard;
