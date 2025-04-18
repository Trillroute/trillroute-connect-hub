
export const calculateProfileProgress = (data: any) => {
  const fields = [
    // Personal fields
    data.teachingExperienceYears,
    data.primaryInstrument,
    data.primaryInstrumentLevel,
    data.secondaryInstrument,
    data.secondaryInstrumentLevel,
    // Professional fields
    data.performances,
    data.curriculumExperience,
    data.musicalProjects,
    data.teachingPhilosophy,
    data.bio,
    // Bank details
    data.bank?.accountHolderName,
    data.bank?.bankName,
    data.bank?.accountNumber,
    data.bank?.ifscCode,
    // Arrays (check if they have items)
    ...(data.qualifications || []).map(q => q.qualification),
    ...(data.previousInstitutes || []).map(i => i.name),
    ...(data.classExperience || []),
    ...(data.comfortableGenres || [])
  ];

  const nonEmptyFields = fields.filter(field => {
    if (Array.isArray(field)) {
      return field.length > 0;
    }
    return field !== undefined && field !== null && field !== '';
  });

  return (nonEmptyFields.length / fields.length) * 100;
};
