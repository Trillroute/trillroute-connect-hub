
import React from 'react';
import {
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface LevelHeaderProps {
  onRefresh: () => void;
  onCreateLevel: () => void;
  canAddLevel: boolean;
}

const LevelHeader: React.FC<LevelHeaderProps> = ({
  onRefresh,
  onCreateLevel,
  canAddLevel,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
      <div>
        <CardTitle>Level Management</CardTitle>
        <CardDescription>Manage permission levels</CardDescription>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        {canAddLevel && (
          <Button onClick={onCreateLevel}>
            <Plus className="h-4 w-4 mr-2" />
            Add Level
          </Button>
        )}
      </div>
    </div>
  );
};

export default LevelHeader;
