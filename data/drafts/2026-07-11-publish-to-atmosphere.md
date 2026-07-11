---
title: Publish to Atmosphere
date: 2026-07-11 21:36:00
---

I saw this blog post linked on Bluesky:
https://mastrojs.github.io/blog/2026-06-05-how-to-add-standard-site-support-to-your-website/
and as I've said before, that's actually what drove me to look more into Mastro.

After having moved my blog to Mastro, and publishing it to my own domain, I was
ready to integrate Mastro's support for publishing to the Atproto network.

```sh
pnpm add jsr:@mastrojs/atproto
```

and then copy/paste the example `publishToAtmosphere.ts` script from the
[@mastrojs/atproto README](https://github.com/mastrojs/atproto#README).

I updated `identifier`, `pubUrl`, `name`, `description`, `icon.blob` and the
`basicTheme` colors.

I wish there was a way to preview what the Publication card will look like on
Bsky and mu.social. Especially with the colors. For now I just used some of the
colors from the OK.css css variables.

After that I just ran the script locally with `node publishToAtmosphere.ts`.
