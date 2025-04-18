
import React from 'react';
import { Button } from '@/components/ui/button';

interface TabButtonsProps {
  currentTab: string;
  setActiveTab: (tab: string) => void;
  isLastTab?: boolean;
}

const TabButtons = ({ currentTab, setActiveTab, isLastTab }: TabButtonsProps) => {
  const getNextTab = (current: string) => {
    switch (current) {
      case 'personal': return 'education';
      case 'education': return 'professional';
      case 'professional': return 'bank';
      default: return 'personal';
    }
  };

  const getPreviousTab = (current: string) => {
    switch (current) {
      case 'education': return 'personal';
      case 'professional': return 'education';
      case 'bank': return 'professional';
      default: return 'personal';
    }
  };

  return (
    <div className="flex justify-between">
      {currentTab !== 'personal' && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab(getPreviousTab(currentTab))}
        >
          Previous
        </Button>
      )}
      {!isLastTab && (
        <Button
          type="button"
          onClick={() => setActiveTab(getNextTab(currentTab))}
          className="ml-auto"
        >
          Next: {getNextTab(currentTab).charAt(0).toUpperCase() + getNextTab(currentTab).slice(1)} Info
        </Button>
      )}
      {isLastTab && (
        <Button type="submit" className="bg-music-500 hover:bg-music-600 ml-auto">
          Register Teacher
        </Button>
      )}
    </div>
  );
};

export default TabButtons;
