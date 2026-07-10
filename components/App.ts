import { type Html, html } from "@mastrojs/mastro";

interface Props {
  children: Html;
  title: string;
  canonicalUrl?: string;
}

export const App = (props: Props) => {
  const canonicalUrl = props.canonicalUrl
    ? html`<link rel="canonical" href="${props.canonicalUrl}" />`
    : null;

  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${props.title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/andrewh0/okcss@2/dist/core.min.css"
        />
        <link rel="stylesheet" href="/styles.css" />
        ${canonicalUrl}
      </head>
      <body>
        <h1>${props.title}</h1>
        ${props.children}
      </body>
    </html>
  `;
};
