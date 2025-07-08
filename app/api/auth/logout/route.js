// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Clear the cookie by setting maxAge to 0
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
