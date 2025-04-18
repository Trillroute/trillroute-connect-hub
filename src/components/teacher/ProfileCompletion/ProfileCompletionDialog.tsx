
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EducationalInfoTab from '@/components/admin/teacher-onboarding/EducationalInfoTab';
import ProfessionalInfoTab from '@/components/admin/teacher-onboarding/ProfessionalInfoTab';
import BankDetailsTab from '@/components/admin/teacher-onboarding/BankDetailsTab';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfileCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  handleQualificationChange: (index: number, field: string, value: string) => void;
  handleArrayChange: (field: string, value: string[]) => void;
  handleInstituteChange: (index: number, field: string, value: string) => void;
  addQualification: () => void;
  removeQualification: (index: number) => void;
  addInstitute: () => void;
  removeInstitute: (index: number) => void;
  onSubmit: () => Promise<void>;
}

export const ProfileCompletionDialog = ({
  open,
  onOpenChange,
  formData,
  handleInputChange,
  handleQualificationChange,
  handleArrayChange,
  handleInstituteChange,
  addQualification,
  removeQualification,
  addInstitute,
  removeInstitute,
  onSubmit
}: ProfileCompletionDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit();
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="education" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="education">Educational Info</TabsTrigger>
            <TabsTrigger value="professional">Professional Info</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
          </TabsList>
          <TabsContent value="education">
            <EducationalInfoTab 
              formData={formData} 
              handleQualificationChange={handleQualificationChange}
              addQualification={addQualification}
              removeQualification={removeQualification}
            />
          </TabsContent>
          <TabsContent value="professional">
            <ProfessionalInfoTab
              formData={formData}
              handleInputChange={handleInputChange}
              handleArrayChange={handleArrayChange}
              handleInstituteChange={handleInstituteChange}
              addInstitute={addInstitute}
              removeInstitute={removeInstitute}
            />
          </TabsContent>
          <TabsContent value="bank">
            <BankDetailsTab
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
