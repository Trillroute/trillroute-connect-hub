
import React, { useState } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DayAvailabilityPanel from './DayAvailabilityPanel';
import CopyDayDialog from './CopyDayDialog';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface UserAvailabilityScheduleProps {
  dailyAvailability: DayAvailability[];
  loading: boolean;
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
  onCopyDay: (fromDay: number, toDay: number) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

const UserAvailabilitySchedule: React.FC<UserAvailabilityScheduleProps> = ({
  dailyAvailability,
  loading,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  onCopyDay,
  onRefresh
}) => {
  const [activeDay, setActiveDay] = useState("0"); // Default to Sunday
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  
  const handleTabChange = (value: string) => {
    setActiveDay(value);
  };

  const handleCopyDay = () => {
    setIsCopyDialogOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Weekly Availability Schedule</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyDay}
          >
            Copy Day Schedule
          </Button>
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> Refresh</>
            )}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue={activeDay} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-7 w-full">
            {dailyAvailability.map((day) => (
              <TabsTrigger key={day.dayOfWeek} value={day.dayOfWeek.toString()}>
                {day.dayName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dailyAvailability.map((day) => (
            <TabsContent key={day.dayOfWeek} value={day.dayOfWeek.toString()}>
              <DayAvailabilityPanel 
                day={day}
                onAddSlot={(startTime, endTime) => onAddSlot(day.dayOfWeek, startTime, endTime)}
                onUpdateSlot={onUpdateSlot}
                onDeleteSlot={onDeleteSlot}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      <CopyDayDialog 
        open={isCopyDialogOpen} 
        onOpenChange={setIsCopyDialogOpen}
        daysOfWeek={dailyAvailability.map(day => ({ 
          dayOfWeek: day.dayOfWeek, 
          dayName: day.dayName 
        }))}
        onCopyDay={onCopyDay}
      />
    </div>
  );
};

export default UserAvailabilitySchedule;
