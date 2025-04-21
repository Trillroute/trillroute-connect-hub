
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ProfileCompletionDialog } from "@/components/teacher/ProfileCompletion/ProfileCompletionDialog";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { useAuth } from "@/hooks/useAuth";

const TeacherProfileCompletion = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    loading,
    progress,
    formData,
    handleInputChange,
    handleQualificationChange,
    handleArrayChange,
    handleInstituteChange,
    addQualification,
    removeQualification,
    addInstitute,
    removeInstitute,
    saveProfile,
  } = useTeacherProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-semibold">Teacher Dashboard</h1>
      <p className="text-gray-500">
        Welcome, {user?.firstName} {user?.lastName}!
      </p>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Profile Completion</p>
          <p className="text-sm font-medium">{Math.round(progress)}%</p>
        </div>
        <div className="cursor-pointer" onClick={() => setDialogOpen(true)}>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-1">
            Click to complete your profile
          </p>
        </div>
      </div>
      <ProfileCompletionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleQualificationChange={handleQualificationChange}
        handleArrayChange={handleArrayChange}
        handleInstituteChange={handleInstituteChange}
        addQualification={addQualification}
        removeQualification={removeQualification}
        addInstitute={addInstitute}
        removeInstitute={removeInstitute}
        onSubmit={saveProfile}
      />
    </>
  );
};

export default TeacherProfileCompletion;
