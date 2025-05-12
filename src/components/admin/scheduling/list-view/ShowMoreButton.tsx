
import React from 'react';
import { Button } from '@/components/ui/button';

interface ShowMoreButtonProps {
  displayCount: number;
  totalCount: number;
  activeTab: string;
  onShowMore: () => void;
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ 
  displayCount, 
  totalCount, 
  activeTab,
  onShowMore 
}) => {
  if (displayCount >= totalCount) return null;

  return (
    <div className="flex justify-center mt-6">
      <Button 
        variant="outline" 
        onClick={onShowMore}
        className="w-full max-w-sm"
      >
        Show More ({totalCount - displayCount} {activeTab === "events" ? "events" : activeTab === "slots" ? "slots" : "items"} remaining)
      </Button>
    </div>
  );
};

export default ShowMoreButton;
