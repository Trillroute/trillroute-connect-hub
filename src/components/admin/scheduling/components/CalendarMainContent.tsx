
import React, { useState, useEffect } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarSidebar from '../CalendarSidebar';
import EventListView from '../EventListView';
import CalendarViewRenderer from '../CalendarViewRenderer';
import { useCalendar } from '../context/CalendarContext';
import CalendarTitle from './CalendarTitle';
import { useEventHandlers } from './EventHandlers';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useSkills } from '@/hooks/useSkills';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';

interface CalendarMainContentProps {
  hasAdminAccess?: boolean;
  title?: string;
  description?: string;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess = false,
  title,
  description
}) => {
  const [showEventList, setShowEventList] = useState(false);
  const { 
    currentDate, 
    viewMode, 
    setViewMode,
    isCreateEventOpen, 
    setIsCreateEventOpen
  } = useCalendar();
  
  const { 
    handleCreateEventClick, 
    handleEditEvent, 
    handleDeleteEvent, 
    handleDateClick 
  } = useEventHandlers();

  // Get data for selectors
  const { courses } = useCourses();
  const { skills } = useSkills();
  const { teachers } = useTeachers();
  const { students } = useStudents();

  // State for selectors
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'course' | 'skill' | 'teacher' | 'student' | null>(null);

  // Reset selected filter when view mode changes
  useEffect(() => {
    setSelectedFilter(null);
    setFilterType(null);
  }, [viewMode]);

  const viewOptions = [
    { value: 'month', label: 'Month View' },
    { value: 'week', label: 'Week View' },
    { value: 'day', label: 'Day View' },
  ];

  // Create the title element to pass to CalendarHeader
  const titleElement = title ? 
    <div>{title}</div> : 
    <CalendarTitle viewMode={viewMode} currentDate={currentDate} />;

  // Get appropriate options based on filter type
  const getFilterOptions = () => {
    switch (filterType) {
      case 'course':
        return courses.map(course => ({ value: course.id, label: course.title }));
      case 'skill':
        return skills.map(skill => ({ value: skill.id, label: skill.name }));
      case 'teacher':
        return teachers.map(teacher => ({ 
          value: teacher.id, 
          label: `${teacher.first_name} ${teacher.last_name}` 
        }));
      case 'student':
        return students.map(student => ({ 
          value: student.id, 
          label: `${student.first_name} ${student.last_name}` 
        }));
      default:
        return [];
    }
  };

  // Filter options
  const filterOptions = [
    { value: 'course', label: 'Filter by Course' },
    { value: 'skill', label: 'Filter by Skill' },
    { value: 'teacher', label: 'Filter by Teacher' },
    { value: 'student', label: 'Filter by Student' }
  ];

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        title={titleElement}
        showEventListToggle={true}
        onToggleEventList={() => setShowEventList(!showEventList)}
        isEventListShown={showEventList}
        hasAdminAccess={hasAdminAccess}
      />
      
      <div className="flex flex-wrap gap-2 px-4 py-2 border-b items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {viewOptions.find(opt => opt.value === viewMode)?.label || 'Select View'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {viewOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setViewMode(option.value as any)}
                className={viewMode === option.value ? "bg-gray-100" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter type selector */}
        <Select 
          value={filterType || 'none'} 
          onValueChange={(value) => {
            setFilterType(value === 'none' ? null : value as any);
            setSelectedFilter(null);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No filter</SelectItem>
            {filterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Conditional filter value selector */}
        {filterType && (
          <Select 
            value={selectedFilter || 'none'} 
            onValueChange={setSelectedFilter}
            disabled={getFilterOptions().length === 0}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={`Select a ${filterType}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select an option</SelectItem>
              {getFilterOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <CalendarSidebar />
        
        <div className="flex-1 overflow-auto">
          {showEventList ? (
            <EventListView 
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <CalendarViewRenderer 
              viewMode={viewMode}
              showEventList={showEventList}
              onCreateEvent={() => setIsCreateEventOpen(true)}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onDateClick={handleDateClick}
              filterType={filterType}
              filterId={selectedFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarMainContent;
