
import React from 'react';

interface EmptyFilteredResultsProps {
  activeTab: string;
}

const EmptyFilteredResults: React.FC<EmptyFilteredResultsProps> = ({ activeTab }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className="text-gray-500 text-center">
        <div className="text-lg mb-2">No upcoming {activeTab === "all" ? "items" : activeTab}</div>
        <div className="text-sm">
          {activeTab === "events" ? "No upcoming events scheduled" : 
           activeTab === "slots" ? "No availability slots configured" : 
           "No upcoming events or availability slots found"}
        </div>
      </div>
    </div>
  );
};

export default EmptyFilteredResults;
