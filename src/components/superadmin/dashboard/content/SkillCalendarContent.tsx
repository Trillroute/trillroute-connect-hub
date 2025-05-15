
import React, { useState, useEffect } from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import { useSkills } from '@/hooks/useSkills';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const SkillCalendarContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  
  const { skills, loading } = useSkills();
  
  useEffect(() => {
    if (skills.length > 0 && !selectedSkillId) {
      setSelectedSkillId(skills[0].id);
    }
  }, [skills, selectedSkillId]);
  
  const handleSkillChange = (value: string) => {
    console.log('Skill selected:', value);
    setSelectedSkillId(value);
    
    // Show toast for debugging
    const skillName = skills.find(s => s.id === value)?.name || 'Unknown';
    toast({
      title: "Skill Selected",
      description: `Filtering calendar for skill: ${skillName}`,
    });
  };
  
  return (
    <ContentWrapper
      title="Skill Calendar"
      description="View and manage schedule by skill"
    >
      <div className="mb-6">
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
      </div>
      
      <div className="h-[calc(100vh-280px)]">
        {selectedSkillId ? (
          <FilteredCalendar
            title={`Calendar for ${skills.find(s => s.id === selectedSkillId)?.name || "Selected"} Skill`}
            filterType="skill"
            filterValues={[selectedSkillId]}
            hasAdminAccess={hasAdminAccess}
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
