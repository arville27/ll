import { router } from '@/server/trpc';
import { loginProcedure } from './login';

export const auth = router({
  login: loginProcedure,
});
