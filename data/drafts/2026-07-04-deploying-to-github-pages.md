---
title: Deploying to GitHub Pages
date: 2026-07-04
---

By now I had all the data saved locally. The page looks **very** basic, but at
least everything is there and under my control.

![Screenshot of the blog with just a plain list of links to posts](/assets/2026-07-04-blog-screenshot.png)

I debated whether I should spend at least some time working on the design. But I
decided it'd be more fun to just deploy it, so I could share a link to it on
social media. And then build in public from here on out.

Since I wanted to deploy to GitHub Pages, there was one thing I did want to set
up before sharing it: canonical URLs. I don't have a lot of visitors or
anything, but since I'd be publishing to https://tobbe.github.io/ while also
keeping the hashnode URL alive I didn't want to confuse search engines too much.

The way I implemented that was to add a `canonicalUrl` field to each post's
front matter (for posts that are also on my Hashnode blog). So a full front
matter example could look like this:

```yaml
---
title: Migrating data with prisma migrate
date: 2021-11-28
canonicalUrl: https://tlundberg.com/migrating-data-with-prisma-migrate
cover: /assets/prisma-andrey-novik-unsplash.jpg
coverAlt: Cover image for the post. Glass prisma set on a table. Photo taken by Andrey Novik.
---
```

And then I updated the `App` template layout to generate a `<link>`

```tsx
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
```

And with that, I decided I had done the bare minimum, on the technical side, to
be able to deploy and share a link to my in-progress blog. Now I just had to
clean up (or not publish) the newer posts.
