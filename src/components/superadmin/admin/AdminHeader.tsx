
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, LayoutGrid, Grid2x2, LayoutList } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { type ViewMode } from '../hooks/useAdminManagement';

interface AdminHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onRefresh: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ viewMode, setViewMode, onRefresh }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>Administrator Management</CardTitle>
        <CardDescription>Manage administrator accounts and permissions</CardDescription>
      </div>
      <div className="flex space-x-2 items-center">
        <Button 
          size="sm" 
          variant={viewMode === 'list' ? "secondary" : "outline"}
          onClick={() => setViewMode('list')}
          title="List view"
        >
          <LayoutList className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant={viewMode === 'grid' ? "secondary" : "outline"}
          onClick={() => setViewMode('grid')}
          title="Grid view"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant={viewMode === 'tile' ? "secondary" : "outline"}
          onClick={() => setViewMode('tile')}
          title="Tile view"
        >
          <Grid2x2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
