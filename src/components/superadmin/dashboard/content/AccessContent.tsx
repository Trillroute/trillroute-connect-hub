
import React, { useState, useEffect } from 'react';
import ContentWrapper from './ContentWrapper';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserManagementUser } from '@/types/student';
import { fetchAdmins } from '@/components/superadmin/AdminService';
import { PenTool, RefreshCw, Shield } from 'lucide-react';
import EditAdminLevelDialog from '@/components/superadmin/EditAdminDialog';
import { useToast } from '@/hooks/use-toast';
import { updateAdminLevel } from '@/components/superadmin/AdminRoleService';
import { AdminLevel } from '@/utils/permissions/types';

const AccessContent: React.FC = () => {
  const [admins, setAdmins] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<UserManagementUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const adminsData = await fetchAdmins();
      setAdmins(adminsData);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch administrators. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRole = (admin: UserManagementUser) => {
    setSelectedAdmin(admin);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'teacher') => {
    // This function is required by the EditAdminDialog but we're focusing on admin level changes
    // not role changes, so we'll just log for now
    console.log(`Role change requested from ${userId} to ${newRole}`);
    return Promise.resolve();
  };

  const handleUpdateLevel = async (userId: string, newLevelName: string) => {
    try {
      setIsLoading(true);
      await updateAdminLevel(userId, newLevelName);

      toast({
        title: 'Success',
        description: 'Admin permission level updated successfully.',
      });
      
      loadAdmins();
    } catch (error: any) {
      console.error('Error updating admin level:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update permission level. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentWrapper 
      title="Access Module"
      description="Manage administrator access levels"
    >
      <Card className="p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Administrator Access Control</h3>
          <Button variant="outline" onClick={loadAdmins} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Permission Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading administrators...
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No administrators found.
                  </TableCell>
                </TableRow>
              ) : (
                admins
                  .filter(admin => admin.role === 'admin')
                  .map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        {admin.firstName} {admin.lastName}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium">
                            {admin.adminRoleName || 'Limited View'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditRole(admin)}
                        >
                          <PenTool className="h-4 w-4 mr-1" />
                          Edit Access
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <EditAdminLevelDialog
        admin={selectedAdmin}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateRole={handleUpdateRole}
        isLoading={isLoading}
      />
    </ContentWrapper>
  );
};

export default AccessContent;
