import { NextResponse } from 'next/server';
import { getAllPostMetas } from '@/lib/mdx';

export function GET() {
  const posts = getAllPostMetas();
  return NextResponse.json(posts);
}
