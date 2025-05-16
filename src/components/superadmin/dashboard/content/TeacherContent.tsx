
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import TeacherManagement from '@/components/admin/TeacherManagement';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTeacherSkillUpdater } from '@/hooks/useTeacherSkillUpdater';

const TeacherContent: React.FC = () => {
  const { updating, updateAllTeachers } = useTeacherSkillUpdater();
  const [lastUpdateCount, setLastUpdateCount] = useState<number | null>(null);

  const handleUpdateTeacherSkills = async () => {
    const count = await updateAllTeachers();
    setLastUpdateCount(count);
  };

  return (
    <ContentWrapper
      title="Teacher Management"
      description="Manage teachers and their information"
    >
      <div className="flex justify-end mb-4 gap-2 items-center">
        <Button 
          onClick={handleUpdateTeacherSkills} 
          disabled={updating}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          {updating ? 'Updating Skills...' : 'Update Teacher Skills'}
        </Button>
        {lastUpdateCount !== null && (
          <span className="text-sm text-gray-600">
            {lastUpdateCount} teachers updated
          </span>
        )}
      </div>

      <TeacherManagement />
    </ContentWrapper>
  );
};

export default TeacherContent;
