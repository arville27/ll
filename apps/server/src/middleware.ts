import { sessionOptions } from '@/server/sessionOptions';
import { getIronSession } from 'iron-session/edge';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);

  if (session.user === undefined) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
};

export const config = {
  matcher: ['/', '/student', '/class', '/attendance'],
};
