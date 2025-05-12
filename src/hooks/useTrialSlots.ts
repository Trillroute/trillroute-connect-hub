import { useState, useEffect } from 'react';
import { fetchAvailableSlotsForCourse, hasTrialForCourse } from '@/services/availability/teaching';
import { AvailabilitySlot } from '@/services/availability/teaching/types';

interface UseTrialSlotsResult {
  availableSlots: AvailabilitySlot[];
  hasTrial: boolean;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useTrialSlots = (courseId: string, userId: string): UseTrialSlotsResult => {
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [hasTrial, setHasTrial] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTrialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch available slots
      const slots = await fetchAvailableSlotsForCourse(courseId);
      setAvailableSlots(slots);

      // Check if user has a trial for this course
      const trialStatus = await hasTrialForCourse(userId, courseId);
      setHasTrial(trialStatus);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load trial data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId && userId) {
      loadTrialData();
    }
  }, [courseId, userId]);

  const refresh = async () => {
    await loadTrialData();
  };

  return {
    availableSlots,
    hasTrial,
    loading,
    error,
    refresh
  };
};

