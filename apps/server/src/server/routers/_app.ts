import { router } from '../trpc';
import { attendance } from './attendance';
import { auth } from './auth';
import { student } from './student';
import { studentClass } from './studentClass';

export const appRouter = router({
  // AttendanceProcedure
  attendance,
  // StudentProcedure
  student,
  // StudentClassProcedute
  studentClass,
  // AuthProcedure
  auth,
});
// export type definition of API
export type AppRouter = typeof appRouter;
