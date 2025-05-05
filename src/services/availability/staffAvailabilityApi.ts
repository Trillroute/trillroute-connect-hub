
import { supabase } from "@/integrations/supabase/client";
import { UserAvailabilityMap, mapDbAvailability } from "./types";

// Get all availability slots for all teachers, admins, and superadmins
export const fetchAllStaffAvailability = async (): Promise<UserAvailabilityMap> => {
  try {
    const { data: users, error: usersError } = await supabase
      .from("custom_users")
      .select("id, first_name, last_name")
      .in("role", ["teacher", "admin", "superadmin"]);

    if (usersError) {
      console.error("Error fetching staff users:", usersError);
      return {};
    }

    if (!users || users.length === 0) {
      return {};
    }

    const userIds = users.map(user => user.id);

    const { data, error } = await supabase
      .from("user_availability")
      .select("*")
      .in("user_id", userIds)
      .order("day_of_week", { ascending: true });

    if (error) {
      console.error("Error fetching staff availability:", error);
      return {};
    }

    // Group by user_id
    const availabilityByUser: UserAvailabilityMap = {};
    
    users.forEach(user => {
      availabilityByUser[user.id] = [];
    });

    if (data) {
      data.forEach(slot => {
        const userId = slot.user_id;
        if (!availabilityByUser[userId]) {
          availabilityByUser[userId] = [];
        }
        availabilityByUser[userId].push(mapDbAvailability(slot));
      });
    }

    return availabilityByUser;
  } catch (err) {
    console.error("Failed to fetch staff availability:", err);
    return {};
  }
};
