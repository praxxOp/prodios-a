import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth'; 
import { cookies } from 'next/headers';

export function middleware(request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const url = request.nextUrl.clone();
  const isProtectedRoute = url.pathname.startsWith('/dashboard');

  
  if (isProtectedRoute && !token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

 return NextResponse.next();
}
export const config = {
    matcher: ['/dashboard'],
  };