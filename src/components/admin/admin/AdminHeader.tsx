
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import ViewControls, { ViewMode } from './ViewControls';

interface AdminHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onRefresh: () => void;
  onAddAdmin: () => void;
  selectedIds: string[];
  onBulkDelete: () => void;
  canAddAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  viewMode,
  setViewMode,
  onRefresh,
  onAddAdmin,
  selectedIds,
  onBulkDelete,
  canAddAdmin,
  isSuperAdmin,
  isLoading
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
      <div>
        <CardTitle>Administrator Management</CardTitle>
        <CardDescription>Manage administrator accounts</CardDescription>
      </div>
      <ViewControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={onRefresh}
        onAddAdmin={onAddAdmin}
        selectedIds={selectedIds}
        onBulkDelete={onBulkDelete}
        canAddAdmin={canAddAdmin}
        isSuperAdmin={isSuperAdmin}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminHeader;
