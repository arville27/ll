import { router } from '../trpc';
import { getAttendanceLogProcedure } from './attendanceProc/getAttendanceLog';
import { addAttendanceLogProcedure } from './attendanceProc/addAttendanceLog';
import { addStudentProcedure } from './studentProc/addStudent';
import { editStudentProcedure } from './studentProc/editStudent';
import { deleteStudentByIdProcedure } from './studentProc/deleteStudentById';
import {
  getStudentsPageableProcedure,
  getStudentsProcedure,
} from './studentProc/getStudents';
import { addStudentClassProcedure } from './studentClassProc/addStudentClass';
import { editStudentClassProcedure } from './studentClassProc/editStudentClass';
import { getStudentClassesProcedure } from './studentClassProc/getStudentClasses';
import { getAttendanceLogPerStudentProcedure } from './attendanceProc/getAttendanceLogPerStudent';
import { getStudentClassesPageableProcedure } from './studentClassProc/getStudentClasses';
import { deleteStudentClassProcedure } from './studentClassProc/deleteStudentClass';

export const appRouter = router({
  // AttendanceProcedure
  getAttendanceLog: getAttendanceLogProcedure,
  addAttendanceLog: addAttendanceLogProcedure,
  getAttendanceLogPerStudent: getAttendanceLogPerStudentProcedure,
  // StudentProcedure
  addStudent: addStudentProcedure,
  editStudent: editStudentProcedure,
  deleteStudentById: deleteStudentByIdProcedure,
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
