import type { MetadataRoute } from 'next';
import { getAllPostMetas } from '@/lib/mdx';

const BASE_URL = 'https://briworkman.dev';

const STATIC_ROUTES = ['', '/blog', '/projects', '/uses', '/stats', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  const posts = getAllPostMetas();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
