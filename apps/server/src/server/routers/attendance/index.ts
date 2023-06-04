import { router } from '@/server/trpc';
import { getAttendanceLogProcedure } from './getAttendanceLog';
import { addAttendanceLogProcedure } from './addAttendanceLog';
import { getAttendanceLogPerStudentProcedure } from './getAttendanceLogPerStudent';

export const attendance = router({
  getAttendanceLog: getAttendanceLogProcedure,
  addAttendanceLog: addAttendanceLogProcedure,
  getAttendanceLogPerStudent: getAttendanceLogPerStudentProcedure,
});
