
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { AvailabilitySlot, fetchAvailableSlotsForCourse } from '@/services/availability/teaching';

interface SchedulerProps {
  courseId: string;
  onSlotSelect: (slot: AvailabilitySlot) => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ courseId, onSlotSelect }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      setIsLoading(true);
      try {
        const slots = await fetchAvailableSlotsForCourse(courseId);
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error loading slots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableSlots();
  }, [courseId]);

  // Create a map of dates with available slots
  const datesWithSlots = availableSlots.reduce<{[key: string]: boolean}>((acc, slot) => {
    const dateKey = format(slot.startTime, 'yyyy-MM-dd');
    acc[dateKey] = true;
    return acc;
  }, {});

  // Get slots for the selected date
  const filteredSlots = selectedDate 
    ? availableSlots.filter(slot => 
        format(slot.startTime, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    onSlotSelect(slot);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select a Date</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow"
          modifiers={{
            hasSlots: (date) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              return datesWithSlots[dateKey] || false;
            }
          }}
          modifiersStyles={{
            hasSlots: {
              fontWeight: 'bold',
              backgroundColor: '#f0e7ff', // Light purple
              color: '#6f48eb' // Darker purple
            }
          }}
        />
        <p className="text-sm text-gray-500 mt-2">
          Dates highlighted in purple have available trial class slots
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-music-600" />
          </div>
        ) : filteredSlots.length > 0 ? (
          <div className="space-y-3 max-h-72 overflow-y-auto p-2">
            {filteredSlots.map((slot) => (
              <Card 
                key={slot.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedSlot?.id === slot.id ? 'ring-2 ring-music-500 bg-music-50' : ''
                }`}
                onClick={() => handleSlotSelect(slot)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{format(slot.startTime, 'h:mm a')} - {format(slot.endTime, 'h:mm a')}</p>
                    <p className="text-sm text-gray-600">with {slot.teacherName || 'Teacher'}</p>
                  </div>
                  {slot.teacherName && (
                    <Badge variant="outline" className="bg-music-50">
                      {slot.teacherName.split(' ')[0]}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 border rounded-md bg-gray-50">
            <p className="text-gray-500">
              {selectedDate 
                ? 'No available slots for this date' 
                : 'Please select a date to see available slots'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scheduler;
