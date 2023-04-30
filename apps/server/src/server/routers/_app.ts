import { router } from '../trpc';
import { getAttendanceLogProcedure } from './attendanceProc/getAttendanceLog';
import { addAttendanceLogProcedure } from './attendanceProc/addAttendanceLog';
import { addStudentProcedure } from './studentProc/addStudent';
import { editStudentProcedure } from './studentProc/editStudent';
import { deleteStudentByIdProcedure } from './studentProc/deleteStudentById';
import { getStudentsProcedure } from './studentProc/getStudents';

export const appRouter = router({
  // AttendanceProcedure
  getAttendanceLog: getAttendanceLogProcedure,
  addAttendanceLog: addAttendanceLogProcedure,
  // StudentProcedure
  addStudent: addStudentProcedure,
  editStudent: editStudentProcedure,
  deleteStudentById: deleteStudentByIdProcedure,
  getStudents: getStudentsProcedure,
});
// export type definition of API
export type AppRouter = typeof appRouter;
