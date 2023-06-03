import { router } from '../trpc';
import { addAttendanceLogProcedure } from './attendanceProc/addAttendanceLog';
import { getAttendanceLogProcedure } from './attendanceProc/getAttendanceLog';
import { getAttendanceLogPerStudentProcedure } from './attendanceProc/getAttendanceLogPerStudent';
import { addStudentClassProcedure } from './studentClassProc/addStudentClass';
import { deleteStudentClassProcedure } from './studentClassProc/deleteStudentClass';
import { editStudentClassProcedure } from './studentClassProc/editStudentClass';
import {
  getStudentClassesPageableProcedure,
  getStudentClassesProcedure,
} from './studentClassProc/getStudentClasses';
import { addStudentProcedure } from './studentProc/addStudent';
import { deleteStudentProcedure } from './studentProc/deleteStudent';
import { editStudentProcedure } from './studentProc/editStudent';
import {
  getStudentsPageableProcedure,
  getStudentsProcedure,
} from './studentProc/getStudents';

export const appRouter = router({
  // AttendanceProcedure
  getAttendanceLog: getAttendanceLogProcedure,
  addAttendanceLog: addAttendanceLogProcedure,
  getAttendanceLogPerStudent: getAttendanceLogPerStudentProcedure,
  // StudentProcedure
  addStudent: addStudentProcedure,
  editStudent: editStudentProcedure,
  deleteStudent: deleteStudentProcedure,
  getStudents: getStudentsProcedure,
  getStudentsPageable: getStudentsPageableProcedure,
  // ClassProcedute
  addStudentClass: addStudentClassProcedure,
  editStudentClass: editStudentClassProcedure,
  deleteStudentClass: deleteStudentClassProcedure,
  getStudentClasses: getStudentClassesProcedure,
  getStudentClassesPageable: getStudentClassesPageableProcedure,
});
// export type definition of API
export type AppRouter = typeof appRouter;
