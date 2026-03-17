import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO date string "YYYY-MM-DD"
  description: string;
};

export type Post = PostMeta & {
  content: string;
};

function parseDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function parsePostData(slug: string, data: Record<string, unknown>): PostMeta {
  if (!data.title || !data.date || !data.description) {
    throw new Error(
      `Post "${slug}" is missing required frontmatter fields (title, date, description).`,
    );
  }
  return {
    slug,
    title: String(data.title),
    date: parseDate(data.date),
    description: String(data.description),
  };
}

export function getAllPostMetas(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const file = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
      const { data } = matter(file);
      return parsePostData(slug, data);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const getPost = cache(function getPost(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const file = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(file);

  return { ...parsePostData(slug, data), content };
});
