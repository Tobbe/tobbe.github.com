---
title: Sätteri and Expressive Code
date: 2026-07-08
cover: /assets/satteri-logo.webp
coverAlt: Sätteri's logo
---

Next on my list of things to do was to get syntax highlighting working.

Mastro ships with [micromark](https://github.com/micromark/micromark) as its
default markdown parser. micromark, on its own, doesn't support syntax
highlighting though. Their
[markdown package readme](https://github.com/mastrojs/markdown#README) shows you
how to use markdown-it and remark-rehype. Both of which can be used to add
syntax highlighting to code blocks in your markdown.

## Sätteri

I already had my sights set on Sätteri though. So I added that.

```sh
pnpm add satteri
```

Then I went to my `routes/blog/[slug]/index.server.ts` file and just switched
out `readMarkdownFile` for `fs.readFileSync` + Sätteri's `markdownToHtml`.

```ts
import { markdownToHtml } from "satteri";

const { html, frontmatter } = markdownToHtml(source, {
  features: { gfm: true, frontmatter: true },
});
```

sätteri doesn't support parsing the (yaml) frontmatter yet. So `frontmatter` is
just a plain string. I implemented my own super basic yaml parser to extract the
metadata I needed from that string. After that, all that was left was to put the
`html` string in the document by wrapping it in `unsafeInnerHtml` and passing it
as `children` to the `Post` component.

```ts
// routes/blog/[slug]/index.server.ts
const postMeta = parseFrontmatter(frontmatter?.value);

return htmlToResponse(
  Post({
    title: postMeta.title,
    subtitle: postMeta.subtitle,
    cover: postMeta.cover,
    coverAlt: postMeta.coverAlt,
    canonicalUrl: postMeta.canonicalUrl,
    children: unsafeInnerHtml(html),
  }),
);
```

## Syntax Highlighting

Sätteri worked great with very minimal setup for rendering the markdown to HTML.
And Mastro made it super easy to get it displayed on a page. But so far the end
user experience was still the same as with the default markdown parser.

That all changed when I added the
[Sätteri Expressive Code plugin](https://satteri.bruits.org/docs/expressive-code/).
As the name implies, it integrates
[Expressive Code](https://expressive-code.com). Expressive Code uses
[Shiki](https://shiki.matsu.io) for syntax highlighting. It also adds optional
editor and terminal frames around the code blocks, text and line markers, line
numbers and more.

Thanks to the Expressive Code plugin, the end user experience is now much nicer
as you can see on this page, and in the screenshot below.

![Screenshot of just a bit further up the page, showing off the styled code block with syntax highlighting](/assets/satteri-expressive-code.png)

You get "tabs", filename display and syntax highlighting. I think it looks
great!

Unfortunately, what doesn't look great though is some of the defaults I get with
matcha.css
([see my earlier blog post on Classless CSS Styling](https://tobbe.github.com/posts/2026-07-07-classless-css-styling/))
For example, it lacks padding/margin between code blocks and an immediate
following header.
