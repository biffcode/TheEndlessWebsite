import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.redirect('/user/gems-detail');
}

// Handle all HTTP methods to avoid Route Handler conflicts
export async function POST() {
  return NextResponse.redirect('/user/gems-detail');
}

export async function PUT() {
  return NextResponse.redirect('/user/gems-detail');
}

export async function DELETE() {
  return NextResponse.redirect('/user/gems-detail');
}

export async function PATCH() {
  return NextResponse.redirect('/user/gems-detail');
}

export const dynamic = 'force-dynamic';
