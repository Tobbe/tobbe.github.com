import fs from "node:fs/promises";
import { createOrUpdateStandardSite } from "@mastrojs/atproto";
import type { Publication } from "@mastrojs/atproto";
import { readMarkdownFiles } from "@mastrojs/markdown";

const identifier = "tobbe.dev";
const password = process.env.ATPROTO_PASSWORD;
const pubUrl = new URL("https://tlundberg.com/blog/");

const publication: Publication = {
  url: pubUrl,
  name: "Tobbe Lundberg's place on teh Intarwebs",
  description: "My personal blog",
  // Optional square image for the publication, should be at least 256x256:
  icon: {
    blob: await fs.readFile("routes/logo_tobbe.png"),
    mimeType: "image/png",
  },
  // Optional RGB colors, make sure you have enough contrast:
  basicTheme: {
    background: { r: 0, g: 0, b: 0 },
    foreground: { r: 255, g: 255, b: 255 },
    accent: { r: 92, g: 154, b: 255 }, // button color
    accentForeground: { r: 0, g: 0, b: 0 }, // button text
  },
};

interface PostMeta {
  title: string;
  date: string;
  [index: string]: string;
}

const posts = await readMarkdownFiles<PostMeta>("data/posts/*.md");
const docs = posts.map((p) => ({
  title: p.meta.title,
  publishedAt: new Date(p.meta.date),
  url: new URL(p.slug + "/", pubUrl),
}));

console.log("pub", publication);

console.log("docs", docs);

// await createOrUpdateStandardSite({ identifier, password }, publication, docs);
