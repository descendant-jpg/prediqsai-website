import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch your live published posts from your backend API
  // Note: Replace the URL with your actual endpoint that lists published blog slugs
  const res = await fetch('https://www.prediqsai.com/api/blog/published', { next: { revalidate: 3600 } });
  const posts = await res.json();

  const blogEntries = posts.map((post: any) => ({
    url: `https://www.prediqsai.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://www.prediqsai.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...blogEntries,
  ];
}
