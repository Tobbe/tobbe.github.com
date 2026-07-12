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

One thing that was a bit less well covered in the blog post and README was the
update needed to the blog posts themselves. They need to set a special
`<link rel="site.standard.document" [...]>` tag in their `<head>`. There's a
short mention in the README, but the example `<link>` used syntax that gave me
red squigglies in my editor. And it used `agent.did` plus `doc.url` without an
explanation of where those would come from. `doc.url` is pretty obvious given
the name. But I did not know what `agent.did` was. I also didn't really have a
good way to set link header tags from my blog posts. I have the whole header
element specified in my `App` template. And no way for blog posts to set their
own `<link>` tags.

I solved the `<link>` tag issue by updating `App` to accept generic extra header
tags via a `headerTags` prop. For `agent.did` I assume that's just my own
personal DID. The blog post says "The DID (Decentralized Identifier) uniquely
identifies your user". My DID is "`did:plc:rutxjhccx4xajwsurbjdq6f`". But I'm
still not sure if I should specify the full thing in the `<link>`, or if I'm
suposed to skip the `did:` part or maybe even the full `did:plc` prefix as it's
always the same. I'm guessing I'm supposed to specify the full thing.

After having the Post updates figured out I just ran the publish script locally
with `node publishToAtmosphere.ts`.
