import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { searchParams, pathname } = request.nextUrl;
  const params = Object.fromEntries(searchParams.entries());
  return NextResponse.json({ pathname, params });
};
