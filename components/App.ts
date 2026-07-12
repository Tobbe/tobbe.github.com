import { html } from "@mastrojs/mastro";
import type { Html } from "@mastrojs/mastro";

interface Props {
  children: Html;
  title: string;
  headerTags?: Html[];
}

export const App = (props: Props) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${props.title}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/andrewh0/okcss@2/dist/core.min.css"
        />
        <link rel="stylesheet" href="/styles.css" />
        ${props.headerTags}
      </head>
      <body>
        ${props.children}
      </body>
    </html>
  `;
};
