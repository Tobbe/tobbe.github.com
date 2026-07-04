---
title: Using RedwoodJS as a Static Site Generator
subtitle: Not because you should, but because you can
date: 2022-07-10
canonicalUrl: https://tlundberg.com/using-redwoodjs-as-a-static-site-generator
cover: /assets/grayscale-building-ricardo-gomez-angel-unsplash.jpg
coverAlt: Cover image for the post. Grayscale photo of a building. Photo taken by Ricardo Gomez Angel.
---

My PR for Cell Prerendering recently got merged into the RedwoodJS codebase. It makes it possible to 1. pre-render pages that need URL path parameters, and 2. pre-render pages that uses cells. This combo is super powerful!

Let's say you have an e-commerce storefront with URLs like [/products/redwoodjs-lapel-pin](https://shop.redwoodjs.com/collections/shirts/products/redwoodjs-lapel-pin), [/products/redwoodjs-skater-hat](https://shop.redwoodjs.com/collections/shirts/products/redwoodjs-skater-hat) and [products/redwoodjs-logo-shirt](https://shop.redwoodjs.com/collections/shirts/products/redwoodjs-logo-shirt). 

![Screenshot of e-commerce storefront showing the products/redwoodjs-logo-shirt page](/assets/ssg-rwjs-shop.png)
*The RedwoodJS Shop is not actually built with the technique I'm demonstrating here, I just used it as an example of what one **could** do*

You have probably defined the route that uses those URLs like this: `<Route path="/products/{sku}" page={ProductPage} name="product" prerender />`. The page probably passes the `sku` from the URL on to a `<ProductCell sku={sku} />` to fetch details about the product from your database. So you'd need to be able to tell Redwood what sku(s) to pre-render for, and then Redwood has to know how to execute the GraphQL query in the Cell, with the given sku, connect to your database, return the data, and finally render it all on a page. If you use the latest canary version of Redwood all this is now possible!

As you know, Redwood uses React for its frontend. And the way pre-rendering works with React (and most other JavaScript frontend frameworks) is you generate a static html page and send that to the user's browser. This html page has a `<script>` tag (or several) that downloads the React runtime plus all the javascript logic that you have written for this particular page. It then replaces the static html on the page with dynamic html rendered by the React runtime. When this is done the page is finally ready for user interaction. And now, when you click on a link on the page to navigate somewhere else, this new page you're navigating to will be fully rendered by React. So no matter if you go to another page that is also pre-rendered or not, the existing html that's stored on the server will never be sent to the end user. This is great, because the page stays interactive, and only parts of the page that actually changes when you navigate (i.e. not your side menu, top navigation bar, footer etc) will update. The user gets a smoother experience, and you don't need such a beefy server as you offload a lot of the rendering to the user's client instead.

But what if your page is pretty much all static, and overall very basic? You don't need the interactivity that React brings. And it wouldn't be any rendering work that needed to be done on the server - it would just have to serve static html. In this case you might wonder - why use React at all? And that's a valid question. But let's ignore that for now, or I wouldn't have anything to blog about 😛 (In reality the argument is probably that you have some pages that are very basic, and/or have to be super fast, and you have other pages that are highly dynamic, and you want to use the same tech stack for all of them.) In this case it might make sense to just render pure html pages and statically serve them straight from your web-server like it was 1995 allover again.

![Opera 2.0 web browser](/assets/ssg-opera-yahoo.webp)
*Image from https://thehistoryoftheweb.com/a-mini-browser-for-the-masses/*

Redwood's current pre-render implementation is optimized for the most common use case of fast and SEO-friendly first page loads, and then letting React take over from there to get the interactivity and smooth page transitions you can get with a JS framework.

So of course I had to go and experiment with making it work for that other scenario with 100% static, basic, html pages 😁

I wanted to build out a basic blog that uses markdown files for the blog posts. So the api side of the blog will not read from a database, but rather read files from the file system. This wouldn't even work on Netlify or other JAM-Stack focused hosting providers, because we don't bundle any files like that into the lambdas/serverless functions. So there's nothing to read from the filesystem. But still, it's a pretty common use case to have plog posts as markdown files and then render html pages from those. And locally it works just fine, so let's start there!

I made a `/blog` folder at the root of my project and placed three markdown files in there

![Screenshot of VSCode showing my /blog folder](/assets/ssg-file-tree.png)

I then went and added a `BlogPost` model to `schema.prisma`. You might wonder why I'm adding a database model, when I said I wasn't going to read from a database. But that's only because a lot of Redwood's generators needs a model in there to work with. When everything is generated we can just remove it. We never need to actually migrate our database to include it.

```prisma
model BlogPost {
  slug      String    @id
  author    String
  createdAt DateTime
  updatedAt DateTime?
  title     String
  body      String
}
```

With the model in place I could run `yarn rw g sdl BlogPost`, `yarn rw g cell BlogPost` and `yarn rw g page BlogPost`. I installed [`front-matter`](https://www.npmjs.com/package/front-matter) on my api side to parse the `.md` files, and [`markdown-it`](https://www.npmjs.com/package/markdown-it) on the web side to render the markdown to html.

The `blogPosts` service reads a markdown file (with frontmatter metadata) from the file system, and returns it. Redwood takes that and sends it to the web side using graphql. A Cell gets it, renders the title, the author etc to specific elements, and puts the markdown formatted body into a single `<section>`

I also added a layout with a cell that fetches all the blog posts to build out a navigation menu.

This all works great in my dev environment, both as it is like a normal client/sever React app. But also as pre-rendered pages. Trying to deploy it though, and you'll run into a few problems. This is still just a canary release, so deploying to Netlify (and Vercel, maybe others) is straight up broken. We can work around that on our own though. I have [an issue open](https://github.com/redwoodjs/redwood/issues/6088) for it and a PR with a potential solution that's waiting for the rest of the Redwood team to take a look at it. You can read the issue and the linked PR for more detailed background info. But the solution for now is to update your build command in `netlify.toml`

```toml
[build]
command = "yarn rw prisma generate && yarn rw build --verbose"
```

Compared to the standard build command we're generating the prisma client first, before building anything and that's the key to solving the problem. I also don't do any prisma migrations or data migrations because we don't need any of that since we're not using a database.

Now it should build and deploy successfully.

Going to the page it'll quickly flash the content you want to see, but then just show this 🙁

![Screenshot showing the red text "Something went wrong"](/assets/ssg-error-something-went-wrong.png)

What gives? 

There are a couple of things going on here. First the web server serves the pre-rendered html page, and as soon as the web browser has that page it will start downloading the JavaScript bundles for the page. While it's downloading you see the pre-rendered page. But then when it's finished downloading and renders the React pages and components the BlogPostCell will fire off a gql request to the api side. It'll show its loading state ("Loading...") while the gql does its roundtrip to the api side. And now we'll run into the second problem. As I said at the beginning, when deploying to a serverless environment we're not bundling any extra files with the lambdas. So when the `blogPost` service tries to read the markdown file on the filesystem it fails, because the files aren't there. And so some random error page is returned to the Cell and we get the Cell's error state.

So what's the solution here? Get rid of the JavaScript that replaces our perfectly fine pre-rendered page, and just keep that! We're probably going to add this functionality into Redwood itself. But not yet. So for now we'll have to hack around it (and I ❤️ it!)

To solve this we're going to use one of RW's most underrated features - its scripts! Generate a new script `yarn rw g script ssg` and then execute it as part of the build process

```toml
[build]
command = "yarn rw prisma generate && yarn rw build web --verbose && yarn rw exec ssg"
```

I also went ahead and told it to only build the web side. Because there won't be any javascript triggering any calls to the api side we don't even need it at all anymore.

The `ssg` script goes through all the generated html pages and does a string replace to remove all `<script>` tags that download the React framework code and our app-specific code.

And there we have it! Redwood as a static site generator generating purely static html pages and serving them up on Netlify. Gatsby we're coming for you! (Just kidding, we love Gatsby and all other web frameworks too 😀)

The demo page is deployed here: https://rw-static-site-generator.netlify.app.
And the code for it is on GitHub: https://github.com/Tobbe/rw-static-site-generator.

Go visit the page. Navigate around and you'll notice that it does a full page reload for each page you go to. Normally this isn't all that great. But since the pages are all so small, and just basically text files on some server somewhere, it actually works out great in the end anyway! And now, turn off JavaScript and you'll notice... No difference! Because we ain't using no JS for these pages anymore 😄

---

Cover photo by <a href="https://unsplash.com/@rgaleriacom?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ricardo Gomez Angel</a> on <a href="https://unsplash.com/s/photos/concreto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
