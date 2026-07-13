import { html } from "@mastrojs/mastro";
import type { Html } from "@mastrojs/mastro";

interface Props {
  children?: Html | null;
}

export function PostSubtitle(props: Props) {
  if (!props.children) {
    return null;
  }

  return html`<h2>${props.children}</h2>`;
}
