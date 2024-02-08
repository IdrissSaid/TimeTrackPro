import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const code = request.cookies.get("code")?.value;

  if (!code && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(`${process.env.URL}/`);
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('code', code as string)

  const modifiedRequest = {
    ...request,
    headers: requestHeaders,
  };

  const response = NextResponse.next({ request: modifiedRequest });

  return response;
}
