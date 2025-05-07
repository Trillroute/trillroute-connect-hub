
import React, { useState, useEffect } from 'react';
import { Command, CommandList, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterSelectorProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  selectedFilter: string | null;
  setSelectedFilter: (id: string | null) => void;
  selectedFilters: string[];
  setSelectedFilters: (ids: string[]) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters,
  setSelectedFilters
}) => {
  const [open, setOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const filterTypes = [
    { value: 'course', label: 'Course' },
    { value: 'skill', label: 'Skill' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Admin' }
  ];

  useEffect(() => {
    if (!filterType) {
      setFilterOptions([]);
      return;
    }

    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        let data: FilterOption[] = [];

        switch (filterType) {
          case 'course':
            const { data: courses, error: coursesError } = await supabase
              .from('courses')
              .select('id, name');
            
            if (coursesError) throw coursesError;
            data = courses || [];
            break;

          case 'skill':
            const { data: skills, error: skillsError } = await supabase
              .from('skills')
              .select('id, name');
            
            if (skillsError) throw skillsError;
            data = skills || [];
            break;

          case 'teacher':
          case 'student':
          case 'admin':
            const { data: users, error: usersError } = await supabase
              .from('custom_users')
              .select('id, first_name, last_name')
              .eq('role', filterType === 'admin' ? 'admin' : filterType);
            
            if (usersError) throw usersError;
            data = (users || []).map(user => ({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`
            }));
            break;

          default:
            data = [];
        }

        setFilterOptions(data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        toast({
          title: 'Error',
          description: 'Failed to load filter options',
          variant: 'destructive'
        });
        setFilterOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, [filterType, toast]);

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    setSelectedFilter(null);
    setSelectedFilters([]);
  };

  const handleFilterSelect = (id: string) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter(item => item !== id));
    } else {
      setSelectedFilters([...selectedFilters, id]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              disabled={loading}
            >
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {filterType ? 
                  filterTypes.find(t => t.value === filterType)?.label : 
                  'Select filter type'}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search filter types..." />
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup>
                  {filterTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      onSelect={() => handleFilterTypeChange(type.value)}
                      className="flex items-center"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filterType === type.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span>{type.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {filterType && (
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                disabled={loading || filterOptions.length === 0}
              >
                <div className="truncate">
                  {selectedFilters.length > 0 ? 
                    `${selectedFilters.length} selected` : 
                    'Select options'}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={`Search ${filterType}s...`} />
                <CommandList>
                  <CommandEmpty>No results found</CommandEmpty>
                  <CommandGroup>
                    {Array.isArray(filterOptions) && filterOptions.map((option) => (
                      <CommandItem
                        key={option.id}
                        onSelect={() => handleFilterSelect(option.id)}
                        className="flex items-center"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                            selectedFilters.includes(option.id) ? "bg-primary border-primary" : "opacity-50"
                          )}
                        >
                          {selectedFilters.includes(option.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span>{option.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default FilterSelector;
