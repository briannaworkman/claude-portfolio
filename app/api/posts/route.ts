import { NextResponse } from 'next/server';
import { getAllPostMetas } from '@/lib/mdx';

export function GET() {
  try {
    const posts = getAllPostMetas();
    return NextResponse.json(posts);
  } catch (err) {
    console.error('[/api/posts]', err);
    return NextResponse.json({ error: 'failed to load posts' }, { status: 500 });
  }
}
