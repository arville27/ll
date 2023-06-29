import { router } from '../trpc';
import {
  addAttendanceLogProcedure,
  getAttendanceLogPerStudentProcedure,
  getAttendanceLogProcedure,
  deleteAttendanceLogProcedure,
} from './attendance';
import { loginProcedure, logoutProcedure } from './auth';
import {
  addStudentProcedure,
  deleteStudentProcedure,
  editStudentProcedure,
  getStudentsCountProcedure,
  getStudentsPageableProcedure,
  getStudentsProcedure,
} from './student';
import {
  addStudentClassProcedure,
  deleteStudentClassProcedure,
  editStudentClassProcedure,
  getStudentClassCountProcedure,
  getStudentClassesPageableProcedure,
  getStudentClassesProcedure,
  upgradeStudentClassesProcedure,
} from './studentClass';

export const appRouter = router({
  // AttendanceProcedure
  addAttendanceLog: addAttendanceLogProcedure,
  getAttendanceLogPerStudent: getAttendanceLogPerStudentProcedure,
  getAttendanceLog: getAttendanceLogProcedure,
  deleteAttendanceLog: deleteAttendanceLogProcedure,
  // StudentProcedure
  addStudent: addStudentProcedure,
  deleteStudent: deleteStudentProcedure,
  editStudent: editStudentProcedure,
  getStudentsPageable: getStudentsPageableProcedure,
  getStudents: getStudentsProcedure,
  getStudentsCount: getStudentsCountProcedure,
  // StudentClassProcedute
  addStudentClass: addStudentClassProcedure,
  deleteStudentClass: deleteStudentClassProcedure,
  editStudentClass: editStudentClassProcedure,
  getStudentClassesPageable: getStudentClassesPageableProcedure,
  getStudentClasses: getStudentClassesProcedure,
  upgradeStudentClasses: upgradeStudentClassesProcedure,
  getStudentClassCount: getStudentClassCountProcedure,
  // AuthProcedure
  login: loginProcedure,
  logout: logoutProcedure,
});
// export type definition of API
export type AppRouter = typeof appRouter;
