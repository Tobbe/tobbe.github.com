---
title: Publish to the Atmosphere
date: 2026-07-15 18:06:00
cover: /assets/blue-sky-clouds-tatiana-reusche-unsplash.jpg
coverAlt: Cover image for the post. A blue sky with clouds. Photo taken by Tatiana Reusche.
---

I wanted to publish my blog posts to the Atmosphere. When looking for more info
on the subject I saw this blog post linked on Bluesky:
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

https://standard.site/docs/introduction/#core-lexicons is a good reference for
the standard.site lexicons. For example, I was a bit unsure what to use for
`pubUrl`. I first entered `https://tlundberg.com` as that's the main page where
I list all blog posts. But reading the lexicon definition, I saw this:

> The canonical document URL is formed by combining this value with the document
> path.
>
> – https://standard.site/docs/lexicons/publication/#required-properties

Reading that, I updated `pubUrl` to `https://tlundberg.com/blog/`. But since I
didn't actually have that page yet, I had to also create it. Which I think is a
good idea anyway. So this was a good :poke: to do so. To get something basic up
I just copied `routes/index.server.ts` to `routes/blog/index.server.ts`. And
with that `https://tlundberg.com/blog/` was live.

At this point I also decided it was time to dive into Mastro's source code. I
didn't really feel confident with my current understanding of how things
_really_ worked. And good thing I did! Reading the code for
`createOrUpdateStandardSite` I noticed that it appended `index.html` for
pathnames ending with `/`. So I **also** had to add some kind of route matching
for `/blog/index.html`. This isn't explicitly documented at
https://mastrojs.github.io/docs/routing/#files-and-folders, but the first thing
I tried, adding a `routes/blog/index.html.server.ts` file, worked. I love it
when frameworks follow predictable patterns ❤️

To reduce duplicated code, I moved it all to this new `index.html.server.ts`
file. And then updated `routes/blog/index.server.ts` to just look like this:

```ts
// routes/blog/index.server.ts
export { GET } from "./index.html.server.ts";
```

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
identifies your user". My DID is "`did:plc:rutxjhccx4xajwsurbjdq6f`". But I was
still not sure if I should specify the full thing in the `<link>`, or if I'm
supposed to skip the `did:` part or maybe even the full `did:plc` prefix as it's
always the same. I guessed I was supposed to specify the full thing, and it
seems to have worked 🙂

After having the Post updates figured out I just ran the publish script locally
with `node --env-file=.env publishToAtmosphere.ts`. (.env is where I store my
Atproto password.)

Committed the `.well-known` directory, and made sure all my latest changes were
live on https://tlundberg.com. I then ran the script again.

Unfortunately https://site-validator.fly.dev showed that there was an issue with
the published data.
https://pdsls.dev/at://did:plc:irutxjhccx4xajwsurbjdq6f/site.standard.document/3kr34tt2222gs
was helpful in debugging. Going there I could see that there was a new-line
issue with the record. https://atproto.at was even better for debugging. I could
see the new-line issue there as well, I could also log in and delete the broken
records. And then run the publish script again.

With the initial new-line issue fixed, the site validator showed another issue.
It couldn't find the expected file inside the `.well-known/` directory. After a
quick scan through the GitHub action logs, I noticed that `.well-known/` was not
being included in the uploaded artifact. Reading the
[upload-pages-artifacts docs](https://github.com/actions/upload-pages-artifact#inputs-)
I found the `include-hidden-files` option. It's `false` by default and that
makes the action ignore files and directories starting with a dot (`.`). Setting
that to `true` fixed the `.well-known/` issue. And with that
https://site-validator.fly.dev marked my blog posts as ✅ Valid.

I was very happy to have it validate, but scrolling down to the bottom of the
validation page, I saw this warning

![Document path format: Docment paths should normally have a leading slash. Publication URL format: Publication URLs should normally not have a trailing slash.](/assets/standard-site-warning.png)

I want to fix that, but the platform and the framework I'm using is fighting me.
I first wanted to fix the "Document paths should normally have a leading slash"
issue. I dove into the `@mastrojs/atproto` source and found that it's a really
easy fix. Just have to add a `- 1` to a `.slice()` call. So I did that, and
ended up with a document path like `/2026-07-15-publish-to-the-atmosphere/`. The
other issue to tackle was the trailing slash on the publication URL. The
publication url is set in my local `publishToAtmosphere.ts` script as `pubUrl`.

```ts
// publishToAtmosphere.ts
const pubUrl = new URL("https://tlundberg.com/blog/");
```

I tried just removing the trailing slash from the string passed to `new URL()`,
but that crashed inside some `@astrojs/atproto` code with
`Error: EISDIR: illegal operation on a directory, read`. I could once again dive
into the `@astrojs/atproto` source and find the root cause, but there's another
issue. GitHub Pages. They don't really support directories without a trailing
slash. I have an upcomming blog post about this as well... So I could leave it
at just one warning. But then I'd have the publication URL be
`https://tlundberg.com/blog/` and the document path be
`/2026-07-15-publish-to-the-atmosphere/`. Combining those you'd end up with a 
URL with double slashes
(`https://tlundberg.com/blog//2026-07-15-publish-to-the-atmosphere/`). It works,
but I just felt that's worse than having the two warnings. So for now I decided
to roll back the leading slash change and just live with the two warnings. If I
move to a different hosting provider that's a bit more flexible I might revisit.
Also, who knows? Maybe the validator is wrong, or the spec is too strict, and
this ends up being a non-issue.

<span style="font-size: 80%">(Cover photo by <a href="https://unsplash.com/@reusche?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tatiana Reusche</a> on <a href="https://unsplash.com/photos/a-blue-sky-with-white-clouds-and-a-plane-in-the-distance-YJlizOF3ZS0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>)</span>
