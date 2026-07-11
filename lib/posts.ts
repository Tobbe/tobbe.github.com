import fs from "node:fs/promises";
import { htmlToResponse, unsafeInnerHtml } from "@mastrojs/mastro";
import { readMarkdownFiles } from "@mastrojs/markdown";
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
    const [key, value] = line.split(":").map((s) => s.trim());
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
  const postMd = await fs.readFile(`data/${dir}/${slug}.md`, "utf8");
  const { html, frontmatter } = await markdownToHtml(postMd, {
    features: { gfm: true, frontmatter: true, headingAttributes: true },
    hastPlugins: [expressiveCode({ themes: ["github-dark", "github-light"] })],
  });

  const postMeta = parseFrontmatter(frontmatter?.value);

  const posts = await getSortedPosts();
  const postIndex = posts.findIndex((post) => post.slug === slug);
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost = posts.at(postIndex + 1);

  return htmlToResponse(
    Post({
      title: postMeta.title,
      subtitle: postMeta.subtitle,
      cover: postMeta.cover,
      coverAlt: postMeta.coverAlt,
      canonicalUrl: postMeta.canonicalUrl,
      previousPost,
      nextPost,
      children: unsafeInnerHtml(html),
    }),
  );
}
