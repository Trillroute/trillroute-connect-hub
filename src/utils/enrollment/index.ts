
// Export from enrollmentOperations
export {
  enrollStudentInCourse,
  forceVerifyEnrollment
} from './enrollment/enrollmentOperations';

// Export enrollment queries
export {
  isStudentEnrolledInCourse,
  getStudentEnrolledCourses,
} from './enrollment/enrollmentQueries';

// Export capacity checks
export {
  checkCourseHasSpace,
  isClassAtCapacity
} from './capacity/checkCapacity';
