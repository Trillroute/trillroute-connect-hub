
import { CalendarEvent } from "@/components/admin/scheduling/types";
import { UserManagementUser } from "@/types/student";

// Database event mapping types
export interface DbEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  color: string | null;
  user_id: string;
}
