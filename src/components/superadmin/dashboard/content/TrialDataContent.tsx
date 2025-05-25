
import React from 'react';
import TrialDataManager from '@/components/admin/trial-data/TrialDataManager';

const TrialDataContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Trial Data Management</h2>
        <p className="text-gray-600 mb-6">
          Manage trial class data for testing and development purposes.
        </p>
      </div>
      
      <TrialDataManager />
    </div>
  );
};

export default TrialDataContent;
