
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DayCount } from './types';

interface DayStatusBadgesProps {
  counts: DayCount;
}

const DayStatusBadges: React.FC<DayStatusBadgesProps> = ({ counts }) => {
  const { availableCount, bookedCount, expiredCount } = counts;
  
  return (
    <div className="flex space-x-4">
      {availableCount > 0 && (
        <span className="text-sm">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {availableCount} available
          </Badge>
        </span>
      )}
      {bookedCount > 0 && (
        <span className="text-sm">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {bookedCount} booked
          </Badge>
        </span>
      )}
      {expiredCount > 0 && (
        <span className="text-sm">
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            {expiredCount} expired
          </Badge>
        </span>
      )}
      {availableCount === 0 && bookedCount === 0 && expiredCount === 0 && (
        <span className="text-sm">No slots</span>
      )}
    </div>
  );
};

export default DayStatusBadges;
