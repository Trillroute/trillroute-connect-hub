
import { createRecurringEvents } from './creators/recurringEventCreator';
import { createOneTimeEvents } from './creators/oneTimeEventCreator';

export function useCalendarEventCreation() {
  return {
    createRecurringEvents,
    createOneTimeEvents
  };
}
