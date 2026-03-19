import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPostMetas, getPost } from '@/lib/mdx';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPostMetas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Bri Workman` };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10">
        <time dateTime={post.date} className="text-xs font-mono text-text-muted">
          {post.date}
        </time>
        <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
      </header>
      <div className="prose prose-invert prose-violet max-w-none">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
