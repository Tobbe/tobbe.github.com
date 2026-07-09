---
title: Migrating off Hashnode
subtitle: Owning Your Own Data
date: 2026-06-29
cover: /assets/man-with-suitcase-mantas-hesthaven-unsplash.jpg
coverAlt: Cover image for the post. Man walking away, dragging a suitcase behind him. Photo by Mantas Hesthaven on Unsplash
---

One of the reasons I wanted to set this new blog up was to migrate off Hashnode.
They recently changed their terms of service. When I first switched to them they
promised I'd always be able to download my content. But now they changed that. I
[posted about that on Bluesky](https://bsky.app/profile/tobbe.dev/post/3mp6wc5yzmk2q).
"Own your data" they said. Now I want to do that for real by having all the
content locally on my computer and synced to GitHub as a first step. I'll
probably move it (or mirror it) to [Tangled](https://tangled.org) at some point
as well.

Since they removed the ability to export your content I had to manually go to
each blog post and copy the markdown and paste it into a new local file. I
placed those files inside `/data/posts` in this blog repo.

With a bunch of markdown files in `/data/posts` I needed a way to list them all
together with a link to each one. Mastro has a guide for this at 
https://mastrojs.github.io/guide/static-blog-from-markdown-files/

When I pulled the markdown for all my posts on Hashnode (one by one) that
markdown didn't include the cover image. So I had to go and manually download
all those images. But I didn't want the compressed version Hashnode served. I
wanted the original ones I had uploaded. I couldn't find a way to do that from
Hashnode, so I just did an image search on Google to find them and re-downloaded
them from wherever I originally got them instead. Mostly that meant going to
Unsplash and downloading the original images from there. Then I had to figure
out how to include those images in my blog posts. What I'm doing right now isn't
the optimal solution, but it works. I put the original image in
`routes/assets/<image>.jpg` and then just put a link to it in the frontmatter of
each post as `cover:`. Some images are multiple megabytes in size. That's way
too big. I should optimize them before they're served. I'll implement that
later. When I know where the image is I can just generate an `<img>` element
with `/assets/<image>.jpg` as the `src`. I also added `coverAlt` to the
frontmatter to provide an alt text for the cover image.

All images used in the blog posts themselves were hosted by Hashnode's CDN. I
had no way to download them other than by right-clicking the image and saving
the compressed version shown to me in the browser.

***

<span style="font-size: 80%">(Cover photo by <a href="https://unsplash.com/@mantashesthaven?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mantas Hesthaven</a> on <a href="https://unsplash.com/photos/man-holding-luggage-photo-_g1WdcKcV3w?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>)</span>
