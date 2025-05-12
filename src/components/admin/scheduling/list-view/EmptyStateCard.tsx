
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface EmptyStateCardProps {
  activeTab: string;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ activeTab }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="bg-muted rounded-full p-3 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No upcoming items</h3>
          <p className="text-muted-foreground text-center">
            No upcoming events or availability slots found.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyStateCard;
