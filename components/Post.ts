import { rkeyFromUrl } from "@mastrojs/atproto";
import { html } from "@mastrojs/mastro";
import type { Html } from "@mastrojs/mastro";

import { App } from "./App.ts";

function getEnglishDate(date: Date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const DID = "did:plc:irutxjhccx4xajwsurbjdq6f";

interface Props {
  children: Html;
  title: string;
  subtitle?: string;
  cover?: string;
  coverAlt?: string;
  readingTimeMinutes: number;
  lastModified: Date;
  previousPost?: { slug: string; meta: { title: string } };
  nextPost?: { slug: string; meta: { title: string } };
  canonicalUrl?: string;
}

export const Post = (props: Props) => {
  const canonicalUrl = props.canonicalUrl
    ? html`<link rel="canonical" href="${props.canonicalUrl}" />`
    : [];

  const url = props.canonicalUrl ? new URL(props.canonicalUrl) : null;
  const siteStandardDocument = url
    ? html`<link
        rel="site.standard.document"
        href=${`at://${DID}/site.standard.document/${rkeyFromUrl(url)}`}
      />`
    : [];

  const subtitle = props.subtitle ? html`<h2>${props.subtitle}</h2>` : null;
  const postMeta = html`<div>
    Last modified:
    <time datetime="${props.lastModified.toISOString()}">
      ${getEnglishDate(props.lastModified)}
    </time>
    &bull; Reading time: ${props.readingTimeMinutes} minutes
  </div>`;
  const cover = props.cover
    ? html`<img src="${props.cover}" alt="${props.coverAlt ?? props.title}" />`
    : null;

  const linkToPreviousPost = props.previousPost
    ? html`<span>
        Newer post:
        <a href="/blog/${props.previousPost.slug}/"
          >${props.previousPost.meta.title}</a
        >
      </span>`
    : null;
  const linkToNextPost = props.nextPost
    ? html`<span style="margin-left: auto; text-align: right;">
        Older post:
        <a href="/blog/${props.nextPost.slug}/">${props.nextPost.meta.title}</a>
      </span>`
    : null;

  return App({
    title: props.title,
    headerTags: [...canonicalUrl, ...siteStandardDocument],
    children: html`
      <header style="text-align: center">
        <a href="/" title="Home">Tobbe Lundberg's place on teh Intarwebs</a>
      </header>
      <main>
        <h1>${props.title}</h1>
        ${subtitle}${postMeta}${cover}${props.children}
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
