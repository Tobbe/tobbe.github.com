import { html, htmlToResponse } from "@mastrojs/mastro";
import { App } from "../../components/App.ts";
import { getSortedPosts } from "../../lib/posts.ts";

function dateOnly(stringDate: string) {
  const date = new Date(stringDate);

  const mm = `0${date.getMonth() + 1}`.slice(-2);
  const dd = `0${date.getDate()}`.slice(-2);

  return date.getFullYear() + "-" + mm + "-" + dd;
}

export const GET = async (_req: Request) => {
  return htmlToResponse(
    App({
      title: "tlundberg.com",
      children: html`<hgroup>
          <h1>tlundberg.com</h1>
          <p>Tobbe Lundberg's place on teh Intarwebs</p>
        </hgroup>
        <h2>Blog Posts</h2>
        <ul>
          ${(await getSortedPosts()).map(
            (post) => html`
              <li>
                <a href="/blog/${post.slug + "/"}"
                  >${dateOnly(post.meta.date)} – ${post.meta.title}</a
                >
              </li>
            `,
          )}
        </ul>`,
    }),
  );
};
