
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';

interface FiltersSectionProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  levelFilter: string | null;
  setLevelFilter: (level: string | null) => void;
  durationFilter: string | null;
  setDurationFilter: (duration: string | null) => void;
  uniqueLevels: string[];
  uniqueDurations: string[];
  clearFilters: () => void;
  activeFiltersCount: number;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  showFilters,
  setShowFilters,
  levelFilter,
  setLevelFilter,
  durationFilter,
  setDurationFilter,
  uniqueLevels,
  uniqueDurations,
  clearFilters,
  activeFiltersCount,
}) => {
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center space-x-2 relative"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      
      {showFilters && (
        <div className="mb-6 mt-4 p-5 border rounded-md bg-card shadow-sm transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm flex items-center gap-1">
              <X className="h-3.5 w-3.5" />
              Clear all
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">LEVEL</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueLevels.map(level => level && (
                  <Button
                    key={level}
                    variant={levelFilter === level ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${levelFilter === level ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setLevelFilter(levelFilter === level ? null : level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">DURATION</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueDurations.map(duration => duration && (
                  <Button
                    key={duration}
                    variant={durationFilter === duration ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${durationFilter === duration ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setDurationFilter(durationFilter === duration ? null : duration)}
                  >
                    {duration}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FiltersSection;
