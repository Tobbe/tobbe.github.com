import { type Html, html } from "@mastrojs/mastro";

import { App } from "./App.ts";

interface Props {
  children: Html;
  title: string;
  subtitle?: string;
  cover?: string;
  coverAlt?: string;
  previousPost?: { slug: string; meta: any };
  nextPost?: { slug: string; meta: any };
  canonicalUrl?: string;
}

export const Post = (props: Props) => {
  const subtitle = props.subtitle ? html`<h2>${props.subtitle}</h2>` : null;
  const cover = props.cover
    ? html`<img src="${props.cover}" alt="${props.coverAlt ?? props.title}" />`
    : null;

  const linkToPreviousPost = props.previousPost
    ? html`<span>
        Previous post:
        <a href="/blog/${props.previousPost.slug}/"
          >${props.previousPost.meta.title}</a
        >
      </span>`
    : null;
  const linkToNextPost = props.nextPost
    ? html`<span style="margin-left: auto">
        Next post:
        <a href="/blog/${props.nextPost.slug}/">${props.nextPost.meta.title}</a>
      </span>`
    : null;

  return App({
    title: props.title,
    canonicalUrl: props.canonicalUrl,
    children: html`
      <header style="text-align: center">
        <a href="/" title="Home">Tobbe Lundberg's place on teh Intarwebs</a>
      </header>
      <main>
        <h1>${props.title}</h1>
        ${subtitle}${cover}${props.children}
        <hr />
        <section
          style="display: flex; flex-wrap: wrap; justify-content: space-between;"
        >
          ${linkToPreviousPost}${linkToNextPost}
        </section>
      </main>
    `,
  });
};
