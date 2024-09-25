import { NextResponse } from 'next/server';
import auth from './utils/auth';

export async function middleware(request: { cookies: { delete: (arg0: string) => void; }; url: string | URL | undefined; }) {
  const user = await auth.getDeveloper();

  if (!user) {
    request.cookies.delete('session');
    const response = NextResponse.redirect(new URL('/', request.url));
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/posts', '/developers', '/profile'],
};
