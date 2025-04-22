
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserManagementUser } from '@/types/student';
import { Trash2, Pencil, BriefcaseBusiness, GraduationCap, CreditCard } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeacherProfileFormData } from '@/types/teacherProfile';

interface ViewUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditFromView?: () => void;
  onDeleteUser?: () => void;
  canDeleteUser?: boolean;
}

const ViewUserDialog = ({ 
  user, 
  isOpen, 
  onOpenChange, 
  onEditFromView,
  onDeleteUser,
  canDeleteUser = false
}: ViewUserDialogProps) => {
  const [teacherProfileData, setTeacherProfileData] = useState<TeacherProfileFormData | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch teacher profile data when the dialog opens and the user is a teacher
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (isOpen && user && user.role === 'teacher') {
        setIsLoading(true);
        try {
          // Fetch qualifications
          const { data: qualificationsData } = await supabase
            .from('teacher_qualifications')
            .select('*')
            .eq('user_id', user.id);

          // Fetch professional details
          const { data: professional } = await supabase
            .from('teacher_professional')
            .select('*')
            .eq('user_id', user.id)
            .single();

          // Fetch bank details
          const { data: bankDetails } = await supabase
            .from('teacher_bank_details')
            .select('*')
            .eq('user_id', user.id)
            .single();

          // Map database fields to application fields
          const mappedQualifications = qualificationsData 
            ? qualificationsData.map(q => ({
                qualification: q.qualification || '',
                specialization: q.specialization || '',
                institution: q.institution || '',
                graduationYear: q.graduation_year ? String(q.graduation_year) : '',
                additionalCertifications: q.additional_certifications || '',
                qualifyingCertificate: q.qualifying_certificate || '',
              }))
            : [];

          const previousInstitutes = professional?.previous_institutes 
            ? (typeof professional.previous_institutes === 'string' 
                ? JSON.parse(professional.previous_institutes) 
                : professional.previous_institutes)
            : [];

          setTeacherProfileData({
            qualifications: mappedQualifications,
            previousInstitutes,
            classExperience: professional?.class_experience || [],
            bank: bankDetails ? {
              accountHolderName: bankDetails.account_holder_name || '',
              bankName: bankDetails.bank_name || '',
              accountNumber: bankDetails.account_number || '',
              ifscCode: bankDetails.ifsc_code || '',
              upiId: bankDetails.upi_id || '',
              bankProof: bankDetails.bank_proof || '',
            } : {
              accountHolderName: '',
              bankName: '',
              accountNumber: '',
              ifscCode: '',
              upiId: '',
              bankProof: '',
            },
            teachingExperienceYears: professional?.teaching_experience_years,
            primaryInstrument: professional?.primary_instrument,
            primaryInstrumentLevel: professional?.primary_instrument_level,
            secondaryInstrument: professional?.secondary_instrument,
            secondaryInstrumentLevel: professional?.secondary_instrument_level,
            performances: professional?.performances,
            curriculumExperience: professional?.curriculum_experience,
            musicalProjects: professional?.musical_projects,
            teachingPhilosophy: professional?.teaching_philosophy,
            bio: professional?.bio,
            comfortableGenres: professional?.comfortable_genres || []
          });
        } catch (error) {
          console.error('Error fetching teacher profile data:', error);
        }
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [isOpen, user]);

  if (!user) return null;

  // Helper function to check if a field exists and is not empty
  const hasValue = (value: any) => value !== undefined && value !== null && value !== '';

  // Determine if this is a teacher profile with additional data
  const isTeacher = user.role === 'teacher';
  const hasTeacherData = isTeacher && teacherProfileData !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View details for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        
        {isTeacher && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="qualifications">
                <GraduationCap className="mr-2 h-4 w-4" />
                Qualifications
              </TabsTrigger>
              <TabsTrigger value="professional">
                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                Professional
              </TabsTrigger>
              <TabsTrigger value="bank">
                <CreditCard className="mr-2 h-4 w-4" />
                Bank Details
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <ScrollArea className={isTeacher ? "h-[calc(60vh-10rem)]" : "h-[calc(60vh-5rem)]"} className="pr-4">
          {isTeacher ? (
            <>
              <TabsContent value="basic" className="mt-0">
                <div className="space-y-4 py-4">
                  {/* Basic Information Section */}
                  <div className="bg-muted rounded-md p-3">
                    <h3 className="text-sm font-semibold mb-2 text-primary">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <strong className="text-sm">Full Name:</strong>
                        <p>{user.firstName} {user.lastName}</p>
                      </div>
                      <div>
                        <strong className="text-sm">Email:</strong>
                        <p className="break-all">{user.email}</p>
                      </div>
                      <div>
                        <strong className="text-sm">Role:</strong>
                        <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                      </div>
                      <div>
                        <strong className="text-sm">Created:</strong>
                        <p>{format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                      {hasValue(user.dateOfBirth) && (
                        <div>
                          <strong className="text-sm">Date of Birth:</strong>
                          <p>{user.dateOfBirth}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  {(hasValue(user.primaryPhone) || hasValue(user.secondaryPhone) || hasValue(user.address)) && (
                    <div className="bg-muted rounded-md p-3">
                      <h3 className="text-sm font-semibold mb-2 text-primary">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {hasValue(user.primaryPhone) && (
                          <div>
                            <strong className="text-sm">Primary Phone:</strong>
                            <p>{user.primaryPhone}</p>
                          </div>
                        )}
                        {hasValue(user.secondaryPhone) && (
                          <div>
                            <strong className="text-sm">Secondary Phone:</strong>
                            <p>{user.secondaryPhone}</p>
                          </div>
                        )}
                        {hasValue(user.whatsappEnabled) && (
                          <div>
                            <strong className="text-sm">WhatsApp Enabled:</strong>
                            <p>{user.whatsappEnabled ? 'Yes' : 'No'}</p>
                          </div>
                        )}
                        {hasValue(user.address) && (
                          <div className="col-span-2">
                            <strong className="text-sm">Address:</strong>
                            <p>{user.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Profile photo if available */}
                  {hasValue(user.profilePhoto) && (
                    <div className="bg-muted rounded-md p-3">
                      <h3 className="text-sm font-semibold mb-2 text-primary">Profile Photo</h3>
                      <div className="flex justify-center">
                        <img 
                          src={user.profilePhoto} 
                          alt={`${user.firstName}'s profile`} 
                          className="rounded-md max-h-48 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* ID Proof if available */}
                  {hasValue(user.idProof) && (
                    <div className="bg-muted rounded-md p-3">
                      <h3 className="text-sm font-semibold mb-2 text-primary">ID Proof</h3>
                      <div className="flex justify-center">
                        <img 
                          src={user.idProof} 
                          alt="ID Proof" 
                          className="rounded-md max-h-48 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="qualifications" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <p>Loading qualifications data...</p>
                  </div>
                ) : hasTeacherData && teacherProfileData?.qualifications?.length ? (
                  <div className="space-y-4 py-4">
                    {teacherProfileData.qualifications.map((qualification, index) => (
                      <div key={index} className="bg-muted rounded-md p-3">
                        <h3 className="text-sm font-semibold mb-2 text-primary">Qualification #{index + 1}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {hasValue(qualification.qualification) && (
                            <div>
                              <strong className="text-sm">Qualification:</strong>
                              <p>{qualification.qualification}</p>
                            </div>
                          )}
                          {hasValue(qualification.specialization) && (
                            <div>
                              <strong className="text-sm">Specialization:</strong>
                              <p>{qualification.specialization}</p>
                            </div>
                          )}
                          {hasValue(qualification.institution) && (
                            <div>
                              <strong className="text-sm">Institution:</strong>
                              <p>{qualification.institution}</p>
                            </div>
                          )}
                          {hasValue(qualification.graduationYear) && (
                            <div>
                              <strong className="text-sm">Graduation Year:</strong>
                              <p>{qualification.graduationYear}</p>
                            </div>
                          )}
                          {hasValue(qualification.additionalCertifications) && (
                            <div className="col-span-2">
                              <strong className="text-sm">Additional Certifications:</strong>
                              <p>{qualification.additionalCertifications}</p>
                            </div>
                          )}
                          {hasValue(qualification.qualifyingCertificate) && (
                            <div className="col-span-2">
                              <strong className="text-sm">Certificate:</strong>
                              <div className="mt-2">
                                <a 
                                  href={qualification.qualifyingCertificate} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center"
                                >
                                  <img 
                                    src={qualification.qualifyingCertificate} 
                                    alt="Certificate" 
                                    className="max-h-32 object-contain border rounded"
                                  />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No qualification data found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="professional" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <p>Loading professional data...</p>
                  </div>
                ) : hasTeacherData ? (
                  <div className="space-y-4 py-4">
                    {/* Teaching Experience */}
                    <div className="bg-muted rounded-md p-3">
                      <h3 className="text-sm font-semibold mb-2 text-primary">Teaching Experience</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {hasValue(teacherProfileData.teachingExperienceYears) && (
                          <div>
                            <strong className="text-sm">Years of Experience:</strong>
                            <p>{teacherProfileData.teachingExperienceYears} years</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.primaryInstrument) && (
                          <div>
                            <strong className="text-sm">Primary Instrument:</strong>
                            <p>{teacherProfileData.primaryInstrument} {teacherProfileData.primaryInstrumentLevel ? `(${teacherProfileData.primaryInstrumentLevel})` : ''}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.secondaryInstrument) && (
                          <div>
                            <strong className="text-sm">Secondary Instrument:</strong>
                            <p>{teacherProfileData.secondaryInstrument} {teacherProfileData.secondaryInstrumentLevel ? `(${teacherProfileData.secondaryInstrumentLevel})` : ''}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Previous Institutes */}
                    {teacherProfileData.previousInstitutes && teacherProfileData.previousInstitutes.length > 0 && (
                      <div className="bg-muted rounded-md p-3">
                        <h3 className="text-sm font-semibold mb-2 text-primary">Previous Institutes</h3>
                        {teacherProfileData.previousInstitutes.map((institute, index) => (
                          <div key={index} className="mb-2 pb-2 border-b last:border-0">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <strong className="text-sm">Name:</strong>
                                <p>{institute.name}</p>
                              </div>
                              <div>
                                <strong className="text-sm">Position:</strong>
                                <p>{institute.position}</p>
                              </div>
                              <div>
                                <strong className="text-sm">Duration:</strong>
                                <p>{institute.duration}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Class Experience */}
                    {teacherProfileData.classExperience && teacherProfileData.classExperience.length > 0 && (
                      <div className="bg-muted rounded-md p-3">
                        <h3 className="text-sm font-semibold mb-2 text-primary">Class Experience</h3>
                        <div className="flex flex-wrap gap-2">
                          {teacherProfileData.classExperience.map((experience, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {experience}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Musical Experience */}
                    {(hasValue(teacherProfileData.performances) || hasValue(teacherProfileData.curriculumExperience) || 
                      hasValue(teacherProfileData.musicalProjects)) && (
                      <div className="bg-muted rounded-md p-3">
                        <h3 className="text-sm font-semibold mb-2 text-primary">Musical Experience</h3>
                        {hasValue(teacherProfileData.performances) && (
                          <div className="mb-2">
                            <strong className="text-sm">Performances/Recordings:</strong>
                            <p className="mt-1 whitespace-pre-line">{teacherProfileData.performances}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.curriculumExperience) && (
                          <div className="mb-2">
                            <strong className="text-sm">Curriculum Experience:</strong>
                            <p className="mt-1 whitespace-pre-line">{teacherProfileData.curriculumExperience}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.musicalProjects) && (
                          <div className="mb-2">
                            <strong className="text-sm">Musical Projects:</strong>
                            <p className="mt-1 whitespace-pre-line">{teacherProfileData.musicalProjects}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Teaching Philosophy and Bio */}
                    {(hasValue(teacherProfileData.teachingPhilosophy) || hasValue(teacherProfileData.bio)) && (
                      <div className="bg-muted rounded-md p-3">
                        <h3 className="text-sm font-semibold mb-2 text-primary">About</h3>
                        {hasValue(teacherProfileData.teachingPhilosophy) && (
                          <div className="mb-2">
                            <strong className="text-sm">Teaching Philosophy:</strong>
                            <p className="mt-1 whitespace-pre-line">{teacherProfileData.teachingPhilosophy}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.bio) && (
                          <div>
                            <strong className="text-sm">Bio:</strong>
                            <p className="mt-1 whitespace-pre-line">{teacherProfileData.bio}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No professional data found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bank" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <p>Loading bank details...</p>
                  </div>
                ) : hasTeacherData && hasValue(teacherProfileData.bank) ? (
                  <div className="space-y-4 py-4">
                    <div className="bg-muted rounded-md p-3">
                      <h3 className="text-sm font-semibold mb-2 text-primary">Bank Account Details</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {hasValue(teacherProfileData.bank.accountHolderName) && (
                          <div>
                            <strong className="text-sm">Account Holder:</strong>
                            <p>{teacherProfileData.bank.accountHolderName}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.bank.bankName) && (
                          <div>
                            <strong className="text-sm">Bank Name:</strong>
                            <p>{teacherProfileData.bank.bankName}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.bank.accountNumber) && (
                          <div>
                            <strong className="text-sm">Account Number:</strong>
                            <p>{teacherProfileData.bank.accountNumber}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.bank.ifscCode) && (
                          <div>
                            <strong className="text-sm">IFSC Code:</strong>
                            <p>{teacherProfileData.bank.ifscCode}</p>
                          </div>
                        )}
                        {hasValue(teacherProfileData.bank.upiId) && (
                          <div>
                            <strong className="text-sm">UPI ID:</strong>
                            <p>{teacherProfileData.bank.upiId}</p>
                          </div>
                        )}
                      </div>
                      {hasValue(teacherProfileData.bank.bankProof) && (
                        <div className="mt-4">
                          <strong className="text-sm">Bank Proof:</strong>
                          <div className="mt-2">
                            <a 
                              href={teacherProfileData.bank.bankProof} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <img 
                                src={teacherProfileData.bank.bankProof} 
                                alt="Bank Proof" 
                                className="max-h-48 object-contain border rounded"
                              />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No bank details found</p>
                  </div>
                )}
              </TabsContent>
            </>
          ) : (
            <div className="space-y-4 py-4">
              {/* Basic Information Section */}
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-semibold mb-2 text-primary">Basic Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <strong className="text-sm">Full Name:</strong>
                    <p>{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <strong className="text-sm">Email:</strong>
                    <p className="break-all">{user.email}</p>
                  </div>
                  <div>
                    <strong className="text-sm">Role:</strong>
                    <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                  </div>
                  <div>
                    <strong className="text-sm">Created:</strong>
                    <p>{format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                  {hasValue(user.dateOfBirth) && (
                    <div>
                      <strong className="text-sm">Date of Birth:</strong>
                      <p>{user.dateOfBirth}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Section */}
              {(hasValue(user.primaryPhone) || hasValue(user.secondaryPhone) || hasValue(user.address)) && (
                <div className="bg-muted rounded-md p-3">
                  <h3 className="text-sm font-semibold mb-2 text-primary">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {hasValue(user.primaryPhone) && (
                      <div>
                        <strong className="text-sm">Primary Phone:</strong>
                        <p>{user.primaryPhone}</p>
                      </div>
                    )}
                    {hasValue(user.secondaryPhone) && (
                      <div>
                        <strong className="text-sm">Secondary Phone:</strong>
                        <p>{user.secondaryPhone}</p>
                      </div>
                    )}
                    {hasValue(user.whatsappEnabled) && (
                      <div>
                        <strong className="text-sm">WhatsApp Enabled:</strong>
                        <p>{user.whatsappEnabled ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                    {hasValue(user.address) && (
                      <div className="col-span-2">
                        <strong className="text-sm">Address:</strong>
                        <p>{user.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Student-specific information */}
              {user.role === 'student' && (hasValue(user.parentName) || hasValue(user.guardianRelation)) && (
                <div className="bg-muted rounded-md p-3">
                  <h3 className="text-sm font-semibold mb-2 text-primary">Guardian Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {hasValue(user.parentName) && (
                      <div>
                        <strong className="text-sm">Parent/Guardian Name:</strong>
                        <p>{user.parentName}</p>
                      </div>
                    )}
                    {hasValue(user.guardianRelation) && (
                      <div>
                        <strong className="text-sm">Guardian Relationship:</strong>
                        <p>{user.guardianRelation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin-specific information */}
              {user.role === 'admin' && hasValue(user.adminRoleName) && (
                <div className="bg-muted rounded-md p-3">
                  <h3 className="text-sm font-semibold mb-2 text-primary">Admin Information</h3>
                  <div>
                    <strong className="text-sm">Permission Level:</strong>
                    <p>{user.adminRoleName || "Standard"}</p>
                  </div>
                </div>
              )}

              {/* Profile photo if available */}
              {hasValue(user.profilePhoto) && (
                <div className="bg-muted rounded-md p-3">
                  <h3 className="text-sm font-semibold mb-2 text-primary">Profile Photo</h3>
                  <div className="flex justify-center">
                    <img 
                      src={user.profilePhoto} 
                      alt={`${user.firstName}'s profile`} 
                      className="rounded-md max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* ID Proof if available */}
              {hasValue(user.idProof) && (
                <div className="bg-muted rounded-md p-3">
                  <h3 className="text-sm font-semibold mb-2 text-primary">ID Proof</h3>
                  <div className="flex justify-center">
                    <img 
                      src={user.idProof} 
                      alt="ID Proof" 
                      className="rounded-md max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex space-x-2">
            {onEditFromView && (
              <Button variant="secondary" onClick={onEditFromView}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {onDeleteUser && canDeleteUser && (
              <Button 
                variant="destructive" 
                onClick={onDeleteUser}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
