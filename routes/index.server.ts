import { html, htmlToResponse } from "@mastrojs/mastro";
import { readMarkdownFiles } from "@mastrojs/markdown";
import { App } from "../components/App.ts";

// TODO: Replace this with proper schema validation
interface PostMeta {
  title: string;
  [index: string]: any;
}

export const GET = async (_req: Request) => {
  const posts = await readMarkdownFiles<PostMeta>("data/posts/*.md");

  return htmlToResponse(
    App({
      title: "tlundberg.com",
      // children: post.content,
      children: posts.reverse().map(
        (post) => html`
          <p>
            <a href="blog/${post.slug + "/"}"
              >${post.meta.date} – ${post.meta.title}</a
            >
          </p>
        `,
      ),
    }),
  );
};
