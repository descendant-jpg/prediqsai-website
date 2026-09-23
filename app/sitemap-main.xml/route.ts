import { NextResponse } from 'next';

export async function GET() {
  try {
    const res = await fetch('https://www.prediqsai.com/api/blog/published', { next: { revalidate: 3600 } });
    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];

    // Hardcode the www domain to prevent canonical mismatch
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.prediqsai.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts.map((post: any) => `
  <url>
    <loc>https://www.prediqsai.com/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    // Explicitly return the correct MIME type header required by Google
    return new NextResponse(xml.trim(), {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
      },
    });
  } catch (error) {
    // Safe fallback if the fetch fails during Vercel's prerender
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.prediqsai.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return new NextResponse(fallbackXml.trim(), {
      headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
    });
  }
}
