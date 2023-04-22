import { router } from '../trpc';
import { studentRouter } from './student';
import { attendanceRouter } from './attendance';

export const appRouter = router({
  student: studentRouter,
  attendance: attendanceRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
