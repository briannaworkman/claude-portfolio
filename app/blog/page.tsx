import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPostMetas } from '@/lib/mdx';
import { PageHeader } from '@/components/web/PageHeader';

export const metadata: Metadata = {
  title: 'Blog — Bri Workman',
};

export default function BlogPage() {
  const posts = getAllPostMetas();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHeader title="BLOG" subtitle="Thoughts on AI, engineering, and workflow." />

      {posts.length === 0 ? (
        <p className="text-text-muted font-mono">nothing here yet, check back soon.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border pb-6 last:border-0">
              <Link href={`/blog/${post.slug}`} className="group block">
                <time dateTime={post.date} className="text-xs font-mono text-text-muted">
                  {post.date}
                </time>
                <h2 className="mt-1 text-xl font-semibold group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-1 text-text-muted text-sm">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
