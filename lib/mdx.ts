import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

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

export function getAllPostMetas(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const file = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
      const { data } = matter(file);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const file = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(file);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    content,
  };
}
