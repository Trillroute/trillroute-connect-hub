import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { UserManagementUser } from '@/types/student';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { QualificationData, BankDetails, TeacherProfileFormData } from '@/types/teacherProfile';

async function fetchTeacherProfile(userId: string): Promise<Partial<TeacherProfileFormData>> {
  const { data: qualificationsData, error: qErr } = await supabase
    .from('teacher_qualifications')
    .select('*')
    .eq('user_id', userId);
  
  const qualifications: QualificationData[] = Array.isArray(qualificationsData) 
    ? qualificationsData.map(q => ({
        qualification: q.qualification,
        specialization: q.specialization || '',
        institution: q.institution || '',
        graduationYear: q.graduation_year ? String(q.graduation_year) : '',
        additionalCertifications: q.additional_certifications || '',
        qualifyingCertificate: q.qualifying_certificate || ''
      }))
    : [];
    
  const { data: professionalRows, error: pErr } = await supabase
    .from('teacher_professional')
    .select('*')
    .eq('user_id', userId);
  
  const { data: bankRows, error: bErr } = await supabase
    .from('teacher_bank_details')
    .select('*')
    .eq('user_id', userId);
    
  let bank: BankDetails | undefined;
  if (Array.isArray(bankRows) && bankRows[0]) {
    bank = {
      accountHolderName: bankRows[0].account_holder_name,
      bankName: bankRows[0].bank_name,
      accountNumber: bankRows[0].account_number,
      ifscCode: bankRows[0].ifsc_code,
      upiId: bankRows[0].upi_id || '',
      bankProof: bankRows[0].bank_proof || ''
    };
  }

  const previousInstitutes = professionalRows?.[0]?.previous_institutes
    ? Array.isArray(professionalRows[0].previous_institutes)
      ? professionalRows[0].previous_institutes
      : []
    : [];

  const classExperience = professionalRows?.[0]?.class_experience
    ? Array.isArray(professionalRows[0].class_experience)
      ? professionalRows[0].class_experience
      : []
    : [];
    
  const comfortableGenres = professionalRows?.[0]?.comfortable_genres
    ? Array.isArray(professionalRows[0].comfortable_genres)
      ? professionalRows[0].comfortable_genres
      : []
    : [];

  return {
    qualifications: qualifications,
    previousInstitutes: previousInstitutes,
    classExperience: classExperience,
    bank: bank,
    teachingExperienceYears: professionalRows?.[0]?.teaching_experience_years,
    primaryInstrument: professionalRows?.[0]?.primary_instrument,
    primaryInstrumentLevel: professionalRows?.[0]?.primary_instrument_level,
    secondaryInstrument: professionalRows?.[0]?.secondary_instrument,
    secondaryInstrumentLevel: professionalRows?.[0]?.secondary_instrument_level,
    performances: professionalRows?.[0]?.performances,
    curriculumExperience: professionalRows?.[0]?.curriculum_experience,
    musicalProjects: professionalRows?.[0]?.musical_projects,
    teachingPhilosophy: professionalRows?.[0]?.teaching_philosophy,
    bio: professionalRows?.[0]?.bio,
    comfortableGenres: comfortableGenres,
  };
}

interface ViewUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditFromView?: () => void;
}

const ViewUserDialog = ({ user, isOpen, onOpenChange, onEditFromView }: ViewUserDialogProps) => {
  const [onboarding, setOnboarding] = useState<Partial<TeacherProfileFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'teacher' && user.id && isOpen) {
      setIsLoading(true);
      fetchTeacherProfile(user.id)
        .then(setOnboarding)
        .finally(() => setIsLoading(false));
    } else {
      setOnboarding({});
    }
  }, [user, isOpen]);

  if (!user) return null;
  
  const showTeacherTabs = user.role === 'teacher';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            User Details
            {showTeacherTabs && (
              <span className="ml-2 text-sm text-gray-400">(Teacher Onboarding)</span>
            )}
          </DialogTitle>
          <DialogDescription>
            Detailed information for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="py-4 pr-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className={showTeacherTabs ? "grid w-full grid-cols-6" : "grid w-full grid-cols-3"}>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                {showTeacherTabs && (
                  <>
                    <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                    <TabsTrigger value="professional">Professional Info</TabsTrigger>
                    <TabsTrigger value="bank">Bank Details</TabsTrigger>
                  </>
                )}
              </TabsList>
              
              <TabsContent value="basic" className="pt-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold block">First Name:</span>
                      <span>{user.firstName}</span>
                    </div>
                    <div>
                      <span className="font-semibold block">Last Name:</span>
                      <span>{user.lastName}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold block">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Role:</span>
                    <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Date of Birth:</span>
                    <span>{user.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Parent/Guardian Name:</span>
                    <span>{user.parentName || 'Not provided'}</span>
                  </div>
                  {user.role === 'student' && (
                    <div>
                      <span className="font-semibold block">Guardian Relation:</span>
                      <span>{user.guardianRelation || 'Not provided'}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold block">Created:</span>
                    <span>{format(new Date(user.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="pt-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block">Primary Phone:</span>
                    <span>{user.primaryPhone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Secondary Phone:</span>
                    <span>{user.secondaryPhone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">WhatsApp Enabled:</span>
                    <span>{user.whatsappEnabled ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Address:</span>
                    <span>{user.address || 'Not provided'}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="pt-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold block">Profile Photo:</span>
                    {user.profilePhoto ? (
                      <div className="mt-2">
                        <img 
                          src={user.profilePhoto} 
                          alt="Profile" 
                          className="w-32 h-32 object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <span>No profile photo</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold block">ID Proof:</span>
                    <span>{user.idProof || 'Not provided'}</span>
                  </div>
                </div>
              </TabsContent>

              {showTeacherTabs && (
                <>
                  <TabsContent value="qualifications" className="pt-4">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="space-y-4">
                        {onboarding.qualifications && onboarding.qualifications.length > 0 ? (
                          <table className="w-full text-sm border">
                            <thead>
                              <tr>
                                <th className="p-2 border">Qualification</th>
                                <th className="p-2 border">Specialization</th>
                                <th className="p-2 border">Institution</th>
                                <th className="p-2 border">Graduation Year</th>
                                <th className="p-2 border">Certifications</th>
                              </tr>
                            </thead>
                            <tbody>
                              {onboarding.qualifications.map((q: QualificationData, idx: number) => (
                                <tr key={idx}>
                                  <td className="p-2 border">{q.qualification}</td>
                                  <td className="p-2 border">{q.specialization || '-'}</td>
                                  <td className="p-2 border">{q.institution || '-'}</td>
                                  <td className="p-2 border">{q.graduationYear || '-'}</td>
                                  <td className="p-2 border">{q.additionalCertifications || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div>No qualifications found.</div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="professional" className="pt-4">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : onboarding ? (
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold block">Teaching Experience (years):</span>
                          <span>{onboarding.teachingExperienceYears ?? 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Primary Instrument:</span>
                          <span>{onboarding.primaryInstrument || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Primary Instrument Level:</span>
                          <span>{onboarding.primaryInstrumentLevel || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Secondary Instrument:</span>
                          <span>{onboarding.secondaryInstrument || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Secondary Instrument Level:</span>
                          <span>{onboarding.secondaryInstrumentLevel || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Musical Projects:</span>
                          <span>{onboarding.musicalProjects || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Class Experience:</span>
                          <span>
                            {Array.isArray(onboarding.classExperience) && onboarding.classExperience.length > 0 
                              ? onboarding.classExperience.join(', ')
                              : 'Not provided'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold block">Previous Institutes:</span>
                          <span>
                            {Array.isArray(onboarding.previousInstitutes) && onboarding.previousInstitutes.length > 0
                              ? onboarding.previousInstitutes.map((inst: any, i: number) => (
                                <span key={i}>
                                  {inst.institute}{inst.designation ? ` (${inst.designation})` : ''}{i < onboarding.previousInstitutes.length - 1 ? ', ' : ''}
                                </span>
                              ))
                              : 'Not provided'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold block">Performances:</span>
                          <span>{onboarding.performances || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Curriculum Experience:</span>
                          <span>{onboarding.curriculumExperience || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Genres Comfortable Teaching:</span>
                          <span>
                            {Array.isArray(onboarding.comfortableGenres) && onboarding.comfortableGenres.length > 0 
                              ? onboarding.comfortableGenres.join(', ')
                              : 'Not provided'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold block">Teaching Philosophy:</span>
                          <span>{onboarding.teachingPhilosophy || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Bio:</span>
                          <span>{onboarding.bio || 'Not provided'}</span>
                        </div>
                      </div>
                    ) : (
                      <div>No information found.</div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="bank" className="pt-4">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : onboarding?.bank ? (
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold block">Account Holder Name:</span>
                          <span>{onboarding.bank.accountHolderName}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Bank Name:</span>
                          <span>{onboarding.bank.bankName}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Account Number:</span>
                          <span>{onboarding.bank.accountNumber}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">IFSC Code:</span>
                          <span>{onboarding.bank.ifscCode}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">UPI ID:</span>
                          <span>{onboarding.bank.upiId || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Bank Proof:</span>
                          {onboarding.bank.bankProof ? (
                            <a 
                              href={onboarding.bank.bankProof} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-music-500 underline"
                            >
                              View Bank Proof
                            </a>
                          ) : (
                            <span>No proof uploaded</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>No data found.</div>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </ScrollArea>
        <DialogFooter>
          {onEditFromView && (user.role === 'student' || user.role === 'teacher') && (
            <Button variant="outline" onClick={onEditFromView}>
              Edit
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
