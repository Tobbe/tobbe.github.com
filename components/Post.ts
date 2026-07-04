import { type Html, html } from "@mastrojs/mastro";

import { App } from "./App.ts";

interface Props {
  children: Html;
  title: string;
  subtitle?: string;
  cover?: string;
  coverAlt?: string;
  canonicalUrl?: string;
}

export const Post = (props: Props) => {
  const subtitle = props.subtitle ? html`<h2>${props.subtitle}</h2>` : null;
  const cover = props.cover
    ? html`<img src="${props.cover}" alt="${props.coverAlt ?? props.title}" />`
    : null;

  return App({
    title: props.title,
    canonicalUrl: props.canonicalUrl,
    children: html`${subtitle}${cover}${props.children}`,
  });
};
