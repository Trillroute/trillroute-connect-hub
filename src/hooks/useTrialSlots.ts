
import { useState, useEffect } from 'react';
import { fetchAvailableSlotsForCourse, hasTrialForCourse, createAvailabilitySlot, bookTrialClass } from '@/services/availability/teaching';
import { AvailabilitySlot } from '@/services/availability/teaching/types';

interface UseTrialSlotsResult {
  availableSlots: AvailabilitySlot[];
  hasTrial: boolean;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createAvailability: (startTime: Date, endTime: Date, courseId?: string) => Promise<boolean>;
}

export const useTrialSlots = (courseId?: string, userId?: string): UseTrialSlotsResult => {
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [hasTrial, setHasTrial] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTrialData = async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    try {
      // Fetch available slots
      const slots = await fetchAvailableSlotsForCourse(courseId);
      setAvailableSlots(slots);

      // Check if user has a trial for this course
      if (userId) {
        const trialStatus = await hasTrialForCourse(userId, courseId);
        setHasTrial(trialStatus);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load trial data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadTrialData();
    }
  }, [courseId, userId]);

  const createAvailability = async (startTime: Date, endTime: Date, courseId?: string): Promise<boolean> => {
    if (!userId) {
      setError(new Error('User ID is required to create availability'));
      return false;
    }

    try {
      const success = await createAvailabilitySlot(userId, startTime, endTime, courseId);
      if (success) {
        await loadTrialData();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create availability slot'));
      return false;
    }
  };

  const refresh = async () => {
    await loadTrialData();
  };

  return {
    availableSlots,
    hasTrial,
    loading,
    error,
    refresh,
    createAvailability
  };
};
