
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface ScheduleHeaderProps {
  onCopyDay: () => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  isContentLoading: boolean;
  hasData: boolean;
  operationInProgress: boolean;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  onCopyDay,
  onRefresh,
  isRefreshing,
  isContentLoading,
  hasData,
  operationInProgress
}) => {
  return (
    <div className="flex justify-between mb-4 items-center">
      <h2 className="text-2xl font-bold">Weekly Availability Schedule</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onCopyDay}
          disabled={isContentLoading || isRefreshing || !hasData || operationInProgress}
        >
          Copy Day Schedule
        </Button>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isContentLoading || isRefreshing || operationInProgress}
        >
          {isRefreshing ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Refreshing...</>
          ) : (
            <><RefreshCw className="h-4 w-4 mr-2" /> Refresh</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
