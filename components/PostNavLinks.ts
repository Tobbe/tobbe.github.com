import { html } from "@mastrojs/mastro";
import type { Html } from "@mastrojs/mastro";

interface Props {
  previousPost?: { slug: string; meta: { title: string } };
  nextPost?: { slug: string; meta: { title: string } };
}

export function PostNavLinks(props: Props) {
  if (!props.previousPost && !props.nextPost) {
    return null;
  }

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

  return html`<section
    style="display: flex; flex-wrap: wrap; justify-content: space-between;"
  >
    ${linkToPreviousPost}${linkToNextPost}
  </section>`;
}
