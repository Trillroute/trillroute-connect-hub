
import { supabase } from '@/integrations/supabase/client';
import { addSkillToUser } from './skillStaffService';

/**
 * Updates a teacher's skills based on the courses they teach
 * @param teacherId The ID of the teacher to update skills for
 * @returns Promise resolving to boolean indicating success
 */
export const updateTeacherSkillsFromCourses = async (teacherId: string): Promise<boolean> => {
  try {
    console.log(`Updating skills for teacher ${teacherId} based on their courses`);
    
    // Step 1: Get all courses this teacher teaches
    const { data: teacherCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id, skill, title')
      .contains('instructor_ids', [teacherId]);
    
    if (coursesError) {
      console.error('Error fetching teacher courses:', coursesError);
      return false;
    }
    
    if (!teacherCourses || teacherCourses.length === 0) {
      console.log(`No courses found for teacher ${teacherId}`);
      return true; // No courses, so nothing to update
    }
    
    console.log(`Found ${teacherCourses.length} courses for teacher ${teacherId}`);
    
    // Step 2: Get skill IDs for all the skills needed
    const skillNames = teacherCourses.map(course => course.skill).filter(Boolean);
    
    if (skillNames.length === 0) {
      console.log('No skills found in teacher courses');
      return true;
    }
    
    console.log('Skills needed from courses:', skillNames);
    
    // Step 3: Get skill IDs from the database
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .select('id, name')
      .in('name', skillNames);
    
    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
      return false;
    }
    
    if (!skillsData || skillsData.length === 0) {
      console.log('No matching skills found in database');
      return true;
    }
    
    console.log(`Found ${skillsData.length} skills in database`);
    
    // Step 4: For each skill, add it to the teacher
    let successCount = 0;
    for (const skill of skillsData) {
      const success = await addSkillToUser(teacherId, skill.id);
      if (success) {
        console.log(`Successfully added skill ${skill.name} (${skill.id}) to teacher ${teacherId}`);
        successCount++;
      }
    }
    
    console.log(`Updated ${successCount}/${skillsData.length} skills for teacher ${teacherId}`);
    return true;
    
  } catch (error) {
    console.error('Error updating teacher skills from courses:', error);
    return false;
  }
};

/**
 * Updates skills for all teachers based on the courses they teach
 * @returns Promise resolving to the number of teachers updated
 */
export const updateAllTeachersSkills = async (): Promise<number> => {
  try {
    // Get all teachers
    const { data: teachers, error: teachersError } = await supabase
      .from('custom_users')
      .select('id, first_name, last_name')
      .eq('role', 'teacher');
      
    if (teachersError) {
      console.error('Error fetching teachers:', teachersError);
      return 0;
    }
    
    if (!teachers || teachers.length === 0) {
      console.log('No teachers found');
      return 0;
    }
    
    console.log(`Updating skills for ${teachers.length} teachers`);
    
    // Update each teacher's skills
    let updatedCount = 0;
    for (const teacher of teachers) {
      const success = await updateTeacherSkillsFromCourses(teacher.id);
      if (success) {
        updatedCount++;
        console.log(`Updated skills for ${teacher.first_name} ${teacher.last_name}`);
      }
    }
    
    console.log(`Successfully updated skills for ${updatedCount}/${teachers.length} teachers`);
    return updatedCount;
    
  } catch (error) {
    console.error('Error updating all teachers skills:', error);
    return 0;
  }
};

/**
 * Updates teacher skills whenever a course is created or updated
 * @param courseId ID of the course that was created or updated
 * @returns Promise resolving to boolean indicating success
 */
export const updateTeacherSkillsForCourse = async (courseId: string): Promise<boolean> => {
  try {
    // Get the course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_ids, skill')
      .eq('id', courseId)
      .single();
      
    if (courseError) {
      console.error(`Error fetching course ${courseId}:`, courseError);
      return false;
    }
    
    if (!course || !course.skill || !course.instructor_ids || course.instructor_ids.length === 0) {
      console.log(`No instructors or skill found for course ${courseId}`);
      return false;
    }
    
    // Get the skill ID
    const { data: skillData, error: skillError } = await supabase
      .from('skills')
      .select('id')
      .eq('name', course.skill)
      .maybeSingle();
      
    if (skillError) {
      console.error(`Error fetching skill for ${course.skill}:`, skillError);
      return false;
    }
    
    if (!skillData) {
      console.log(`Skill ${course.skill} not found in database`);
      return false;
    }
    
    // Add the skill to each instructor
    let successCount = 0;
    for (const teacherId of course.instructor_ids) {
      const success = await addSkillToUser(teacherId, skillData.id);
      if (success) successCount++;
    }
    
    console.log(`Added skill to ${successCount}/${course.instructor_ids.length} instructors for course ${courseId}`);
    return successCount > 0;
    
  } catch (error) {
    console.error('Error updating teacher skills for course:', error);
    return false;
  }
};
