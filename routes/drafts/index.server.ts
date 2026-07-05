import { html, htmlToResponse } from "@mastrojs/mastro";
import { readMarkdownFiles } from "@mastrojs/markdown";
import { App } from "../../components/App.ts";

// TODO: Replace this with proper schema validation
interface DraftMeta {
  title: string;
  [index: string]: any;
}

export const GET = async (_req: Request) => {
  const drafts = await readMarkdownFiles<DraftMeta>("data/drafts/*.md");

  return htmlToResponse(
    App({
      title: "Drafts – tlundberg.com",
      children: drafts.reverse().map(
        (draft) => html`
          <p>
            <a href="/draft/${draft.slug + "/"}"
              >${draft.meta.date} – ${draft.meta.title}</a
            >
          </p>
        `,
      ),
    }),
  );
};
