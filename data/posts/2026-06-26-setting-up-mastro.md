---
title: Setting up Mastro
date: 2026-06-26
---

# Why Mastro

Two things really. I wanted to move away from Hashnode (that'll be its own post
in the future). And I wanted to add support for https://standard.site to have my
posts on the ATmosphere
([A deep-as-you-like dive into the ATmosphere](https://atproto.wiki/en/wiki/explainers/deep-dive)).

When researching how to get my posts wired up with standard.site, I found
[Mastros's blog post on the subject](https://mastrojs.github.io/blog/2026-06-05-how-to-add-standard-site-support-to-your-website/)
and that led me to the Mastro framework itself.

I asked some of my friends what they use for their personal websites/blogs. The
normal suspects, Jekyll, Hugo, self-built all came up. And I got some links to
interesting alternatives like https://casual-effects.com/markdeep/,
https://www.getzola.org, and https://zine-ssg.io. And I had myself previously
looked at https://maudit.org.

I'd love to have an actual use case for Rust, so I could better learn it.
Bloggin with Maudit could be that reason. But for now I wanted something that'd
be quicker for me to get started with. And I also wanted something super simple
that I could compose as I wanted and extend as needed. Fastest, for me, would be
to just build with [CedarJS](https://cedarjs.com). But the SSG support isn't yet
what I want it to be. And it is simple for me, since I know it inside and out.
But for everyone else, it's probably quite the opposite 🙈

So of all the alternatives, Mastro seemed to be the best fit for me and this
job.

- ~800 lines of code
- No dependencies
- No build step required
- Decent docs (at least they looked good before I actually started workign on
  the blog 😅)
- And that standards.site blog post definitely also helped

Those were all things that really spoke to me.

# Setup

Mastro was a little confusing to get started with at first.

I started with their setup guide, https://mastrojs.github.io/guide/setup/. It
presented two ways to get started. In a browser environment or on your own
command line. I want to write my blog posts locally, so I chose the command line
option, which linked to a section on their landing page. Once there you have to
make a few more choices. You have to choose your runtime environment (I chose
Node) and then choose between cloning a GitHub repo or run a `create` script.
But it wasn't clear what the actual difference between these two were. So
naturally I had to try both. Turns out running the `create` script then gives
you two new options: "basic" or "blog". So now I had three options to choose
from when getting started, clone, create "basic" or create "blog" :sweat-smile:

After comparing things a bit it looks like the GitHub repo and the "basic"
option are pretty much the same thing. If you go with the "blog" option instead,
you get the "basic" setup, plus two blog posts as markdown files and a page
listing them. It also shows you how to transform those markdown files to html
for viewing in the browser.

Even though I did want a blog, I decided to go with the cloned repo so I could
wire the blog up myself the way I wanted it.

With the repo cloned I started writing this file in
data/posts/2026-06-26-mastro.md

After a while I really wanted to see something in my browser, so I decided to
keep it super basic and render this markdown file on the main index page. To do
so I basically just followed the guide on how to render a single post here
https://mastrojs.github.io/guide/static-blog-from-markdown-files/#detail-pages.
I had to install the `@mastrojs/markdown` package and wire it up.

```sh
pnpm add jsr:@mastrojs/markdown
```

Speaking of following guides, the mastro guide itself doesn't say anything about
updating dependencies, but the README file you get when you clone their template
repo has instructions to do that, so I did `pnpm update "@mastrojs/*" --latest`.

When I then tried to finally view my page in my browser I got this warning:

```sh
 WARN  Unsupported engine: wanted: {"node":"24.17.0"} (current: {"node":"v24.14.1","pnpm":"10.33.4"})
```

I fixed that by updating `package.json`. I chose to not pin the node version,
but instead use `24.x` to allow any minor version of Node 24.

Now I could view my post! So I decided to push it to github after also adding
the deploy workflow from
https://mastrojs.github.io/guide/deploy/ssg-node-github-pages/. Unfortnately the
workflow didn't work.

```
**Annotations**

1 error and 1 warning

⛔️ build
Error: No pnpm version is specified. Please specify it by one of the following ways: - in the GitHub Action config with the key "version" - in the package.json with the key "packageManager"

⚠️ build
Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, pnpm/action-setup@v4.
```

To fix those I specified `devEngines.packageManager` in `package.json`, and I
updated all actions in the github workflow file to their latest major version.
In the future I'll pin them to specific SHA-1 versions to keep things a bit more
secure.

# Meta

When reading about Mastro I noticed that they're using
[@maverick-js/signals](https://npmx.dev/package/@maverick-js/signals). Another
signals library I've been keepign an eye on is
[signalium](https://signalium.dev). I wonder how they compare and when one would
use one over the other. Something to look into in the future! 🙂
