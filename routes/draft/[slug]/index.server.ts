import fs from "node:fs/promises";
import {
  getParams,
  htmlToResponse,
  readDir,
  unsafeInnerHtml,
} from "@mastrojs/mastro";
import { markdownToHtml } from "satteri";
import expressiveCode from "satteri-expressive-code";
import { Post } from "../../../components/Post.ts";

// TODO: Replace this with proper schema validation
interface DraftMeta {
  title: string;
  date: string;
  subtitle?: string;
  cover?: string;
  coverAlt?: string;
  canonicalUrl?: string;
  [index: string]: any;
}

function parseFrontmatter(frontmatter: string = ""): DraftMeta {
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

export const GET = async (req: Request) => {
  const { slug } = getParams(req);

  const postMd = await fs.readFile(`data/drafts/${slug}.md`, "utf8");
  const { html, frontmatter } = await markdownToHtml(postMd, {
    features: { gfm: true, frontmatter: true, headingAttributes: true },
    hastPlugins: [expressiveCode({ themes: ["github-dark", "github-light"] })],
  });

  const postMeta = parseFrontmatter(frontmatter?.value);

  return htmlToResponse(
    Post({
      title: postMeta.title,
      subtitle: postMeta.subtitle,
      cover: postMeta.cover,
      coverAlt: postMeta.coverAlt,
      canonicalUrl: postMeta.canonicalUrl,
      children: unsafeInnerHtml(html),
    }),
  );
};

export const getStaticPaths = async () => {
  const drafts = await readDir("data/drafts/");
  return drafts.map((d) => "/draft/" + d.slice(0, -3) + "/");
};
