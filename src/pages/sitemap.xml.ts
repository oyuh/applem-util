// src/pages/sitemap.xml.ts
import type { GetServerSideProps } from "next";

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const headers = req.headers || {};
  const host = (headers["x-forwarded-host"] as string) || headers.host || "";
  const forwardedProto = (headers["x-forwarded-proto"] as string) || "";
  const isTls = typeof (req.socket as unknown as { encrypted?: boolean }).encrypted === 'boolean' ? (req.socket as unknown as { encrypted?: boolean }).encrypted : false;
  const proto = forwardedProto || (isTls ? "https" : "http");
  const origin = host ? `${proto}://${host}` : "";

  const urls = [
    { loc: `${origin}/`, priority: 1.0 },
    { loc: `${origin}/w`, priority: 0.8 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) =>
        `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function SitemapXml() { return null; }
