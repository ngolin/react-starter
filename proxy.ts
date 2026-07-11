import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/api/:path*',
};

export function proxy({ headers, method }: NextRequest) {
  if (headers.has('origin')) {
    const response = method === 'OPTIONS' ? new NextResponse(null, { status: 204 }) : NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', headers.get('origin')!);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    if (method === 'OPTIONS') {
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set(
        'Access-Control-Allow-Headers',
        headers.get('access-control-request-headers') || 'Content-Type, Authorization',
      );
    }
    return response;
  }
}
