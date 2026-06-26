import { html, htmlToResponse } from "@mastrojs/mastro";
import { readMarkdownFile } from "@mastrojs/markdown";
import { App } from "../components/App.ts";

export const GET = async (_req: Request) => {
  const post = await readMarkdownFile('/data/posts/2026-06-26-mastro.md')

  return htmlToResponse(
    App({
      title: post.meta.title,
      // children: post.content,
      children: html`
        <div>${post.content}</div>
      `,
    }),
  );
};

