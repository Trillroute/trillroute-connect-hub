
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addRandomTrialClasses, clearAllTrialClasses } from '@/utils/addRandomTrialClasses';
import { RefreshCw, Plus, Trash2 } from 'lucide-react';

const TrialDataManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTrialClasses = async () => {
    setIsLoading(true);
    try {
      const success = await addRandomTrialClasses();
      if (success) {
        toast.success('Trial classes added successfully!', {
          description: 'Random trial classes have been assigned to students'
        });
      } else {
        toast.error('Failed to add trial classes');
      }
    } catch (error) {
      console.error('Error adding trial classes:', error);
      toast.error('An error occurred while adding trial classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTrialClasses = async () => {
    setIsLoading(true);
    try {
      const success = await clearAllTrialClasses();
      if (success) {
        toast.success('All trial classes cleared!');
      } else {
        toast.error('Failed to clear trial classes');
      }
    } catch (error) {
      console.error('Error clearing trial classes:', error);
      toast.error('An error occurred while clearing trial classes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Trial Data Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Development Tool:</strong> Use this to populate trial data for testing the enrollment system.
          </p>
          <p className="text-xs text-blue-600">
            This will create trial booking events in the user_events table for students with random course assignments.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleAddTrialClasses}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Random Trial Classes
          </Button>
          
          <Button 
            onClick={handleClearTrialClasses}
            disabled={isLoading}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Trial Classes
          </Button>
        </div>
        
        {isLoading && (
          <div className="text-sm text-gray-600">
            Processing... Please wait.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrialDataManager;
