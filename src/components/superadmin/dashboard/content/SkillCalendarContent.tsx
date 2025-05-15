
import React, { useState, useEffect } from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import { useSkills } from '@/hooks/useSkills';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const SkillCalendarContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  const { skills, loading } = useSkills();
  
  useEffect(() => {
    if (skills.length > 0 && !selectedSkillId) {
      setSelectedSkillId(skills[0].id);
      console.log('Auto-selected first skill:', skills[0].id, skills[0].name);
    }
  }, [skills, selectedSkillId]);
  
  const handleSkillChange = (value: string) => {
    console.log('Skill selected:', value);
    setSelectedSkillId(value);
    
    // Find the selected skill name
    const skillName = skills.find(s => s.id === value)?.name || 'Unknown';
    
    // Show toast with debugging info
    toast({
      title: "Skill Selected",
      description: `Filtering calendar for skill: ${skillName} (ID: ${value})`,
    });
    
    // Force a refresh on skill change
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing Calendar",
      description: "Reloading skill data and calendar...",
    });
    setRefreshKey(prev => prev + 1);
  };
  
  const selectedSkill = skills.find(s => s.id === selectedSkillId);
  
  // If we have no skills at all, show a message
  if (!loading && skills.length === 0) {
    return (
      <ContentWrapper
        title="Skill Calendar"
        description="View and manage schedule by skill"
      >
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-gray-500 mb-4">No skills found in the system.</p>
          <p className="text-gray-500">Please add skills before using this view.</p>
        </div>
      </ContentWrapper>
    );
  }
  
  return (
    <ContentWrapper
      title="Skill Calendar"
      description="View and manage schedule by skill"
    >
      <div className="mb-6 flex items-center gap-4">
        <Select 
          value={selectedSkillId} 
          onValueChange={handleSkillChange}
          disabled={loading || skills.length === 0}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a skill" />
          </SelectTrigger>
          <SelectContent>
            {skills.map(skill => (
              <SelectItem key={skill.id} value={skill.id}>
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh}
          title="Refresh calendar"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-100 text-xs rounded-md">
        <p>Selected Skill: {selectedSkill?.name || 'Unknown'}</p>
        <p>Skill ID: {selectedSkillId}</p>
        <p>Total Skills Available: {skills.length}</p>
        <p>Refresh Key: {refreshKey}</p>
      </div>
      
      <div className="h-[calc(100vh-280px)]">
        {selectedSkillId ? (
          <FilteredCalendar
            key={`skill-calendar-${selectedSkillId}-${refreshKey}`}
            title={`Calendar for ${selectedSkill?.name || "Selected"} Skill`}
            filterType="skill"
            filterValues={selectedSkillId ? [selectedSkillId] : []}
            hasAdminAccess={hasAdminAccess}
            showFilterTabs={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full border rounded-md bg-gray-50">
            <p className="text-gray-500">Please select a skill to view its calendar</p>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default SkillCalendarContent;
