
import { supabase } from "@/integrations/supabase/client";

export interface UserAvailability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  createdAt: Date;
  updatedAt: Date;
}

// Convert database format to frontend format
const mapDbAvailability = (dbItem: any): UserAvailability => ({
  id: dbItem.id,
  userId: dbItem.user_id,
  dayOfWeek: dbItem.day_of_week,
  startTime: dbItem.start_time,
  endTime: dbItem.end_time,
  createdAt: new Date(dbItem.created_at),
  updatedAt: new Date(dbItem.updated_at)
});

// Get all availability slots for a user
export const fetchUserAvailability = async (userId: string): Promise<UserAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .order("day_of_week", { ascending: true });

    if (error) {
      console.error("Error fetching user availability:", error);
      return [];
    }

    return data ? data.map(mapDbAvailability) : [];
  } catch (err) {
    console.error("Failed to fetch user availability:", err);
    return [];
  }
};

// Create a new availability slot for a user
export const createAvailabilitySlot = async (
  userId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string
): Promise<UserAvailability | null> => {
  try {
    const { data, error } = await supabase
      .from("user_availability")
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating availability slot:", error);
      return null;
    }

    return data ? mapDbAvailability(data) : null;
  } catch (err) {
    console.error("Failed to create availability slot:", err);
    return null;
  }
};

// Update an existing availability slot
export const updateAvailabilitySlot = async (
  id: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_availability")
      .update({
        start_time: startTime,
        end_time: endTime,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating availability slot:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to update availability slot:", err);
    return false;
  }
};

// Delete an availability slot
export const deleteAvailabilitySlot = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_availability")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting availability slot:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to delete availability slot:", err);
    return false;
  }
};

// Get all availability slots for all teachers, admins, and superadmins
export const fetchAllStaffAvailability = async (): Promise<{[userId: string]: UserAvailability[]}> => {
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
    const availabilityByUser: {[userId: string]: UserAvailability[]} = {};
    
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

// Copy availability from one day to another
export const copyDayAvailability = async (
  userId: string,
  fromDay: number,
  toDay: number
): Promise<boolean> => {
  try {
    // First, get all slots for the source day
    const { data: sourceSlots, error: sourceError } = await supabase
      .from("user_availability")
      .select("*")
      .eq("user_id", userId)
      .eq("day_of_week", fromDay);

    if (sourceError) {
      console.error("Error fetching source day slots:", sourceError);
      return false;
    }

    if (!sourceSlots || sourceSlots.length === 0) {
      console.warn("No slots found for the source day");
      return false;
    }

    // Delete existing slots for the target day
    const { error: deleteError } = await supabase
      .from("user_availability")
      .delete()
      .eq("user_id", userId)
      .eq("day_of_week", toDay);

    if (deleteError) {
      console.error("Error deleting existing slots for target day:", deleteError);
      return false;
    }

    // Create new slots for the target day based on source day
    const newSlots = sourceSlots.map(slot => ({
      user_id: userId,
      day_of_week: toDay,
      start_time: slot.start_time,
      end_time: slot.end_time
    }));

    const { error: insertError } = await supabase
      .from("user_availability")
      .insert(newSlots);

    if (insertError) {
      console.error("Error copying slots to target day:", insertError);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to copy day availability:", err);
    return false;
  }
};
