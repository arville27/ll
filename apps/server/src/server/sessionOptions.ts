// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session';

export type User = {
  isLoggedIn: boolean;
  login: string;
  avatarUrl: string;
};

export const sessionOptions: IronSessionOptions = {
  password: process.env.COOKIE_PASSWORD ?? 'superlong-cookie-password-for-development',
  cookieName: 'll-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}
