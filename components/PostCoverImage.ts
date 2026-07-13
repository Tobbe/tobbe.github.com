import { html } from "@mastrojs/mastro";

interface Props {
  src?: string | null;
  alt?: string | null;
}

export function PostCoverImage(props: Props) {
  if (!props.src) {
    return null;
  }

  return html`<img src="${props.src}" alt="${props.alt ?? ""}" />`;
}
