import React, { useState } from 'react';
import SchedulingCalendar from '@/components/admin/scheduling/Calendar';
import ContentWrapper from './ContentWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Calendar, Clock, Users } from "lucide-react";
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  const [activeView, setActiveView] = useState<'calendar' | 'blocked-hours'>('calendar');
  
  return (
    <ContentWrapper
      title="Scheduling"
      description="Manage your class and event scheduling"
    >
      <div className="flex justify-between items-center mb-4">
        <Badge variant="outline" className="bg-gray-100">
          Viewing as: {role?.toUpperCase()}
        </Badge>

        <Tabs 
          defaultValue="calendar" 
          className="w-[400px]"
          onValueChange={(value) => setActiveView(value as 'calendar' | 'blocked-hours')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="blocked-hours" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Blocked Hours
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full border rounded-md bg-white shadow-sm h-[calc(100vh-220px)]">
        {activeView === 'calendar' ? (
          <SchedulingCalendar hasAdminAccess={hasAdminAccess} />
        ) : (
          <BlockedHoursManager />
        )}
      </div>
    </ContentWrapper>
  );
};

// BlockedHoursManager component for managing blocked hours
const BlockedHoursManager: React.FC = () => {
  const [blockedHours, setBlockedHours] = useState<any[]>([]);
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (user) {
      fetchBlockedHours();
    }
  }, [user]);
  
  const fetchBlockedHours = async () => {
    try {
      const { data: hours, error } = await supabase
        .from('blocked_hours')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });
        
      if (!error) {
        setBlockedHours(hours || []);
      }
    } catch (err) {
      console.error("Failed to fetch blocked hours:", err);
    }
  };
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dayNames.map((day, index) => (
          <Card key={day} className="p-4">
            <h3 className="font-semibold text-lg mb-3">{day}</h3>
            
            <div className="space-y-2">
              {blockedHours
                .filter(hour => hour.day_of_week === index)
                .map(hour => (
                  <div key={hour.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span>
                        {hour.start_time.substring(0, 5)} - {hour.end_time.substring(0, 5)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {hour.reason || "Unavailable"}
                    </div>
                  </div>
                ))}
              
              {blockedHours.filter(hour => hour.day_of_week === index).length === 0 && (
                <div className="text-sm text-gray-500 italic">No blocked hours</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SchedulingContent;
