import fs from "node:fs/promises";
import { htmlToResponse, unsafeInnerHtml } from "@mastrojs/mastro";
import { readMarkdownFiles } from "@mastrojs/markdown";
import readingTime from "reading-time";
import { markdownToHtml } from "satteri";
import expressiveCode from "satteri-expressive-code";
import { Post } from "../components/Post.ts";

// TODO: Replace this with proper schema validation
interface PostMeta {
  title: string;
  date: string;
  subtitle?: string;
  cover?: string;
  coverAlt?: string;
  canonicalUrl?: string;
  [index: string]: any;
}

export async function getSortedPosts() {
  return (await readMarkdownFiles<PostMeta>("data/posts/*.md")).sort(
    (postA, postB) => {
      return (
        new Date(postB.meta.date).getTime() -
        new Date(postA.meta.date).getTime()
      );
    },
  );
}

function parseFrontmatter(frontmatter: string = ""): PostMeta {
  const lines = frontmatter.split("\n");
  const fmObj: Record<string, string | undefined> = {};

  for (const line of lines) {
    const index = line.indexOf(":");
    if (index === -1) {
      // TODO: Propably throw an error
      continue;
    }

    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    // Remove wrapping single or double quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && value) {
      fmObj[key] = value;
    }
  }

  if (!fmObj.title) {
    console.error("Missing post title in\n", frontmatter);
    throw new Error("Missing post title");
  }

  if (!fmObj.date) {
    console.error("Missing post date in\n", frontmatter);
    throw new Error("Missing post date");
  }

  return {
    title: fmObj?.title,
    date: fmObj?.date,
    subtitle: fmObj?.subtitle,
    cover: fmObj?.cover,
    coverAlt: fmObj?.coverAlt,
    canonicalUrl: fmObj?.canonicalUrl,
  };
}

export async function renderPost(dir: string, slug?: string) {
  const fileStats = await fs.stat(`data/${dir}/${slug}.md`);
  const postMd = await fs.readFile(`data/${dir}/${slug}.md`, "utf8");
  const { html, frontmatter } = await markdownToHtml(postMd, {
    features: { gfm: true, frontmatter: true, headingAttributes: true },
    hastPlugins: [expressiveCode({ themes: ["github-dark", "github-light"] })],
  });

  const postMeta = parseFrontmatter(frontmatter?.value);
  const { minutes } = readingTime(postMd);

  const posts = await getSortedPosts();
  const postIndex = posts.findIndex((post) => post.slug === slug);
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost = posts.at(postIndex + 1);
  const canonicalUrl =
    postMeta.canonicalUrl ?? `https://tlundberg.com/blog/${slug}/`;

  return htmlToResponse(
    Post({
      title: postMeta.title,
      subtitle: postMeta.subtitle,
      cover: postMeta.cover,
      coverAlt: postMeta.coverAlt,
      canonicalUrl,
      readingTimeMinutes: Math.round(minutes),
      lastModified: fileStats.mtime,
      previousPost,
      nextPost,
      children: unsafeInnerHtml(html),
    }),
  );
}
