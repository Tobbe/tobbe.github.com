import { rkeyFromUrl } from "@mastrojs/atproto";
import { html } from "@mastrojs/mastro";
import type { Html } from "@mastrojs/mastro";

import { App } from "./App.ts";
import { PostCoverImage } from "./PostCoverImage.ts";
import { PostMeta } from "./PostMeta.ts";
import { PostNavLinks } from "./PostNavLinks.ts";
import { PostSubtitle } from "./PostSubTitle.ts";

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

  return App({
    title: props.title,
    headerTags: [...canonicalUrl, ...siteStandardDocument],
    children: html`
      <header style="text-align: center">
        <a href="/" title="Home">Tobbe Lundberg's place on teh Intarwebs</a>
      </header>
      <main>
        <h1>${props.title}</h1>
        ${PostSubtitle({ children: props.subtitle })}
        ${PostMeta({
          lastModified: props.lastModified,
          readingTimeMinutes: props.readingTimeMinutes,
        })}
        ${PostCoverImage({
          src: props.cover,
          alt: props.coverAlt ?? props.title,
        })}
        ${props.children}
        <hr />
        ${PostNavLinks({
          previousPost: props.previousPost,
          nextPost: props.nextPost,
        })}
      </main>
    `,
  });
};
