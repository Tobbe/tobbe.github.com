---
title: Classless CSS Styling
date: 2026-07-07
cover: /assets/art-supplies-anna-kolosyuk-unsplash.jpg
coverAlt: Cover image for the post. Paint tubes in the background and paint brushes with paint on them in the foreground. Photo taken by Anna Kolosyuk.
---

I've known about classless CSS for a long time, and I use it for my basic
contact page, [tobbe.dev](https://tobbe.dev). For that page I use
[Terminal CSS](https://terminalcss.xyz).

Classless CSS is a term used for frameworks or libraries that use CSS selectors
based on element types, attributes and document structure to provide styles for
your website. The idea is that you shouldn't have to add a bunch of custom
classes to all your html elements to get a nice looking website. This makes your
html (or jsx) faster to write and easier to read. Plus it usually leads to
smaller downloads and faster page loads compared to pages using a bunch of
custom classes.

The most well-known classless CSS framework is probably
[pico.css](https://picocss.com). But there are a **lot** of them! I've already
mentioned [Terminal CSS](https://terminalcss.xyz) and when I was talking about
personal blogs with friends someone mentioned
[matcha.css](https://matcha.mizu.sh). There's a whole list available at
https://github.com/dbohdan/classless-css. That matcha framework though... With a
name like that I was kind of hooked before even looking at it 🍵

So that's what I decided to try to use first.

Here are a couple of before and after screenshots:

![Top section of a post before adding matcha.css](/assets/websockets-in-redwoodjs-unstyled-top.webp "Webpage screenshot before 1")
![Scrolled section of a post before adding matcha.css](/assets/websockets-in-redwoodjs-unstyled-scrolled.webp "Webpage screenshot before 2")
![Top section of a post after adding matcha.css](/assets/websockets-in-redwoodjs-matcha-top.webp "Webpage screenshot after 1")
![Scrolled section of a post after adding matcha.css](/assets/websockets-in-redwoodjs-matcha-scrolled.webp "Webpage screenshot after 2")

Definitely looks better with the matcha styles applied! But also defintely room
for improvement. So now I have to decide if I should stick with matcha and try
to customize it, or if I should try to find a different framework that looks
more like what I want out of the box.

For now though, I'll just leave it like this and focus on the next thing, which
is code syntax highlighting.

*EDIT 2026-07-08:* The bugs I'm finding with matcha.css, especially around
spacing, is really starting to bother me. I'll probably bump up the prio on
finding an alternative.

***

<span style="font-size: 80%">(Cover photo by <a href="https://unsplash.com/@anko_?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Anna Kolosyuk</a> on <a href="https://unsplash.com/photos/three-silver-paint-brushes-on-white-textile-D5nh6mCW52c?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>)</span>
