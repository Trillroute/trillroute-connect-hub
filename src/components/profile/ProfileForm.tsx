
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Save, User, GraduationCap, Briefcase, Wallet } from 'lucide-react';
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
          <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="data-[state=active]:bg-music-100 data-[state=active]:text-music-800">
              <User className="mr-2 h-4 w-4" />
              Basic Info
            </TabsTrigger>
            {isTeacher && (
              <>
                <TabsTrigger value="education" className="data-[state=active]:bg-music-100 data-[state=active]:text-music-800">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Educational Info
                </TabsTrigger>
                <TabsTrigger value="professional" className="data-[state=active]:bg-music-100 data-[state=active]:text-music-800">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Professional Info
                </TabsTrigger>
                <TabsTrigger value="bank" className="data-[state=active]:bg-music-100 data-[state=active]:text-music-800">
                  <Wallet className="mr-2 h-4 w-4" />
                  Bank Details
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="basic" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <BasicInfoFields form={form} isStudent={isStudent} />
          </TabsContent>

          {isTeacher && (
            <>
              <TabsContent value="education" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="border border-border/40 shadow-sm rounded-lg p-6 bg-card">
                  <EducationalInfoTab
                    formData={teacherFormData}
                    handleQualificationChange={handleQualificationChange}
                    addQualification={addQualification}
                    removeQualification={removeQualification}
                  />
                </div>
              </TabsContent>

              <TabsContent value="professional" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="border border-border/40 shadow-sm rounded-lg p-6 bg-card">
                  <ProfessionalInfoTab
                    formData={teacherFormData}
                    handleInputChange={handleInputChange}
                    handleArrayChange={handleArrayChange}
                    handleInstituteChange={handleInstituteChange}
                    addInstitute={addInstitute}
                    removeInstitute={removeInstitute}
                  />
                </div>
              </TabsContent>

              <TabsContent value="bank" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="border border-border/40 shadow-sm rounded-lg p-6 bg-card">
                  <BankDetailsTab
                    formData={teacherFormData}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>

        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-music-500 hover:bg-music-600 text-white" 
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
