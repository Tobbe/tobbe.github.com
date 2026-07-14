import fs from "node:fs/promises";

import { getParams, html, htmlToResponse, readDir } from "@mastrojs/mastro";

function trimQuotes(str?: string) {
  return str
    ?.replace(/^"/, "")
    .replace(/^'/, "")
    .replace(/"$/, "")
    .replace(/'$/, "");
}

export const GET = async (req: Request) => {
  const { redirects: partialSlug } = getParams(req);

  console.log("typeof partialSlug", typeof partialSlug);
  console.log("partialSlug >" + partialSlug + "<");

  if (!partialSlug) {
    throw new Error("500 No slug provided");
  }

  const posts = await readDir("data/posts/");
  const postPath = posts.find((p) => p.includes(partialSlug));

  if (!postPath) {
    throw new Error("404 Post not found");
  }

  const postMd = await fs.readFile(`data/posts/${postPath}`, "utf8");
  const mdLines = postMd.split("\n");
  const title = trimQuotes(
    mdLines.find((l) => l.startsWith("title: "))?.slice(7),
  );
  const canonicalUrl = trimQuotes(
    mdLines.find((l) => l.startsWith("canonicalUrl: "))?.slice(14),
  );

  if (!canonicalUrl) {
    throw new Error("500 No canonicalUrl provided");
  }

  return htmlToResponse(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
        <meta
          http-equiv="refresh"
          content="0;url=/blog/${postPath.slice(0, -3)}/"
        />
        <link rel="canonical" href="${canonicalUrl}" />
      </head>
      <body style="padding: 1rem">
        <strong style="font-size: 1.5rem">
          The page been moved to
          <a href="${canonicalUrl}">${canonicalUrl}</a>
        </strong>
        <pre>${postMd}</pre>
      </body>
    </html>
  `);
};

export const getStaticPaths = async () => {
  const posts = await readDir("data/posts/");
  return (
    posts
      // Take the first 4 characters of the filename to get the year. Every post
      // older than 2026 needs a redirect.
      .filter((p) => parseInt(p.slice(0, 4), 10) < 2026)
      // URLs on Hashnode didn't include the date, so I remove the first 11
      // characters. They also don't end in .md, so I remove the last 3
      // characters as well.
      .map((p) => "/" + p.slice(11, -3))
  );
};
