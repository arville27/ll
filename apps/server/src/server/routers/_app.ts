import { router } from '../trpc';
import {
  addAttendanceLogProcedure,
  getAttendanceLogPerStudentProcedure,
  getAttendanceLogProcedure,
} from './attendance';
import { loginProcedure, logoutProcedure } from './auth';
import {
  addStudentProcedure,
  deleteStudentProcedure,
  editStudentProcedure,
  getStudentsPageableProcedure,
  getStudentsProcedure,
} from './student';
import {
  addStudentClassProcedure,
  deleteStudentClassProcedure,
  editStudentClassProcedure,
  getStudentClassesPageableProcedure,
  getStudentClassesProcedure,
} from './studentClass';

export const appRouter = router({
  // AttendanceProcedure
  addAttendanceLog: addAttendanceLogProcedure,
  getAttendanceLogPerStudent: getAttendanceLogPerStudentProcedure,
  getAttendanceLog: getAttendanceLogProcedure,
  // StudentProcedure
  addStudent: addStudentProcedure,
  deleteStudent: deleteStudentProcedure,
  editStudent: editStudentProcedure,
  getStudentsPageable: getStudentsPageableProcedure,
  getStudents: getStudentsProcedure,
  // StudentClassProcedute
  addStudentClass: addStudentClassProcedure,
  deleteStudentClass: deleteStudentClassProcedure,
  editStudentClass: editStudentClassProcedure,
  getStudentClassesPageable: getStudentClassesPageableProcedure,
  getStudentClasses: getStudentClassesProcedure,
  // AuthProcedure
  login: loginProcedure,
  logout: logoutProcedure,
});
// export type definition of API
export type AppRouter = typeof appRouter;
