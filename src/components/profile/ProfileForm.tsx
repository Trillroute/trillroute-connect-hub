
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import EducationalInfoTab from '@/components/admin/teacher-onboarding/EducationalInfoTab';
import ProfessionalInfoTab from '@/components/admin/teacher-onboarding/ProfessionalInfoTab';
import BankDetailsTab from '@/components/admin/teacher-onboarding/BankDetailsTab';
import { supabase } from '@/integrations/supabase/client';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BasicInfoFields } from './BasicInfoFields';
import { profileSchema, type ProfileFormValues } from '@/schemas/profileSchema';

export function ProfileForm() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  const {
    formData: teacherFormData,
    handleInputChange,
    handleQualificationChange,
    handleArrayChange,
    handleInstituteChange,
    addQualification,
    removeQualification,
    addInstitute,
    removeInstitute,
    saveProfile: saveTeacherProfile,
  } = useTeacherProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dateOfBirth: user?.dateOfBirth || '',
      primaryPhone: user?.primaryPhone || '',
      secondaryPhone: user?.secondaryPhone || '',
      whatsappEnabled: user?.whatsappEnabled || false,
      address: user?.address || '',
      parentName: user?.parentName || '',
      guardianRelation: user?.guardianRelation || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        dateOfBirth: user.dateOfBirth || '',
        primaryPhone: user.primaryPhone || '',
        secondaryPhone: user.secondaryPhone || '',
        whatsappEnabled: user.whatsappEnabled || false,
        address: user.address || '',
        parentName: user.parentName || '',
        guardianRelation: user.guardianRelation || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('custom_users')
        .update({
          date_of_birth: data.dateOfBirth || null,
          primary_phone: data.primaryPhone || null,
          secondary_phone: data.secondaryPhone || null,
          whatsapp_enabled: data.whatsappEnabled || false,
          address: data.address || null,
          parent_name: data.parentName || null,
          guardian_relation: role === 'student' ? data.guardianRelation || null : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = {
        ...user,
        dateOfBirth: data.dateOfBirth || undefined,
        primaryPhone: data.primaryPhone || undefined,
        secondaryPhone: data.secondaryPhone || undefined,
        whatsappEnabled: data.whatsappEnabled,
        address: data.address || undefined,
        parentName: data.parentName || undefined,
        guardianRelation: role === 'student' ? data.guardianRelation || undefined : undefined,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      });

      if (isTeacher) {
        await saveTeacherProfile();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            {isTeacher && (
              <>
                <TabsTrigger value="education">Educational Info</TabsTrigger>
                <TabsTrigger value="professional">Professional Info</TabsTrigger>
                <TabsTrigger value="bank">Bank Details</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <BasicInfoFields form={form} isStudent={isStudent} />
          </TabsContent>

          {isTeacher && (
            <>
              <TabsContent value="education">
                <EducationalInfoTab
                  formData={teacherFormData}
                  handleQualificationChange={handleQualificationChange}
                  addQualification={addQualification}
                  removeQualification={removeQualification}
                />
              </TabsContent>

              <TabsContent value="professional">
                <ProfessionalInfoTab
                  formData={teacherFormData}
                  handleInputChange={handleInputChange}
                  handleArrayChange={handleArrayChange}
                  handleInstituteChange={handleInstituteChange}
                  addInstitute={addInstitute}
                  removeInstitute={removeInstitute}
                />
              </TabsContent>

              <TabsContent value="bank">
                <BankDetailsTab
                  formData={teacherFormData}
                  handleInputChange={handleInputChange}
                />
              </TabsContent>
            </>
          )}
        </Tabs>

        <Button 
          type="submit" 
          className="w-full sm:w-auto" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
