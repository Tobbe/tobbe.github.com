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
      children: html`<hgroup>
          <h1>tlundberg.com</h1>
          <p>Tobbe Lundberg's place on teh Intarwebs</p>
        </hgroup>
        <h2>Blog Posts</h2>
        <ul>
          ${posts.reverse().map(
            (post) => html`
              <li>
                <a href="blog/${post.slug + "/"}"
                  >${post.meta.date} – ${post.meta.title}</a
                >
              </li>
            `,
          )}
        </ul>`,
    }),
  );
};
