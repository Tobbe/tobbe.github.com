---
title: Visualizing your Prisma schema in a RedwoodJS project
date: 2022-07-08
canonicalUrl: https://tlundberg.com/visualizing-your-prisma-schema-in-a-redwoodjs-project
cover: /assets/prisma-big-erd.webp
coverAlt: A big ER diagram of a Prisma schema
---

Do you want to have a visualization of your database models? Using Redwood to build your fullstack application? Then this guide is for you! I'm going to show how easy it is to generate an ER diagram, and keep it updated!

We'll be using [keonik/prisma-erd-generator](https://github.com/keonik/prisma-erd-generator) which is an npm package that you can use like a kind of plugin to prisma to generate an svg ER diagram of your prisma schema.

First thing you need to do is to install it. In the root of your RW project, run this command (yes, we're not specifying any workspace here):

```zsh
yarn add -D prisma-erd-generator @mermaid-js/mermaid-cli
```

You'll then need to add a bit of config to the top of your schema file (`api/prisma/schema.prisma`), right below the generator config for client (`generate client { ... }`)

```prisma
generator erd {
  provider = "prisma-erd-generator"
  output   = "./ERD.svg"
}
```

Save the file and now you're ready to generate the diagram. Run this command from the root of your project (it can take a *long* time the first time you run it). (If you're trying this on a fresh project, make sure you've ran at least one migration before trying to add and run the erd generator.)

```bash
yarn rw prisma generate
```

That should have produced an SVG file at `api/prisma/ERD.svg`. Open it up (for example using your web browser) and you should see all your models and relations from your schema file.

What's great here is that whenever prisma runs `generate` you'll get a new diagram. So, for example, whenever you generate a new migration you'll also get an up-to-date visual representation of your database model. How great is that?!

For a basic schema like this:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  createdAt DateTime @default(now())
  userId    Int?
  user      User?    @relation(fields: [userId], references: [id])
}

model Contact {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}

model User {
  id                  Int       @id @default(autoincrement())
  email               String    @unique
  hashedPassword      String
  salt                String
  resetToken          String?
  resetTokenExpiresAt DateTime?
  roles               String?
  posts               Post[]
}
```

You'll get a diagram like this:

![Small three-model ERD.png](/assets/prisma-erd.png)
