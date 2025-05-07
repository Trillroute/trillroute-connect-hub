
import { supabase } from "@/integrations/supabase/client";
import { UserAvailabilityMap, mapDbAvailability } from "./types";

// Get all availability slots for all teachers, admins, and superadmins
export const fetchAllStaffAvailability = async (): Promise<UserAvailabilityMap> => {
  try {
    // First, get all teacher, admin, and superadmin users
    const { data: users, error: usersError } = await supabase
      .from("custom_users")
      .select("id, first_name, last_name, role")
      .in("role", ["teacher", "admin", "superadmin"]);

    if (usersError) {
      console.error("Error fetching staff users:", usersError);
      throw usersError;
    }

    if (!users || users.length === 0) {
      console.log("No staff users found");
      return {};
    }

    // Get the IDs of all staff members
    const userIds = users.map(user => user.id);
    console.log(`Found ${userIds.length} staff members, fetching their availability`);

    // Now fetch all availability slots for these users
    const { data: availabilityData, error: availabilityError } = await supabase
      .from("user_availability")
      .select("*")
      .in("user_id", userIds)
      .order("day_of_week", { ascending: true });

    if (availabilityError) {
      console.error("Error fetching staff availability:", availabilityError);
      throw availabilityError;
    }

    console.log(`Found ${availabilityData?.length || 0} availability slots for staff members:`, availabilityData);

    // Group by user_id
    const availabilityByUser: UserAvailabilityMap = {};
    
    // Initialize with user data first
    users.forEach(user => {
      const fullName = `${user.first_name} ${user.last_name}`;
      availabilityByUser[user.id] = {
        slots: [],
        name: fullName,
        role: user.role
      };
    });

    // Then add availability data
    if (availabilityData && availabilityData.length > 0) {
      availabilityData.forEach(slot => {
        const userId = slot.user_id;
        if (!availabilityByUser[userId]) {
          // This shouldn't happen, but just in case
          availabilityByUser[userId] = {
            slots: [],
            name: "Unknown User",
            role: "staff"
          };
        }
        availabilityByUser[userId].slots.push(mapDbAvailability(slot));
      });
    }

    return availabilityByUser;
  } catch (err) {
    console.error("Failed to fetch staff availability:", err);
    throw err;
  }
};
