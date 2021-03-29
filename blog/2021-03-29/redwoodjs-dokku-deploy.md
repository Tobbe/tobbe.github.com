---
date: "2021-03-29"
title: "Deploying a RedwoodJS app on Dokku"
category: "RedwoodJS"
tags: ["RedwoodJS", "Dokku", "DevOps", "Hosting"]
banner: "/assets/bg/docks.jpg"
---

This is a guide on how to self host a Redwood project using [Dokku](https://dokku.com/). Some familiarity with Linux and the command line is required. If you're just getting started with Redwood and want something easy and free I recommend deploying to [Netlify](https://netlify.com) or [Vercel](https://vercel.com), both of which have first-class Redwood support.

If you don't know what Dokku is, the short version is that it's like a self-hosted version of Heroku. It uses the same buildpacks, procfiles and deployment process as Heroku. There are other, more advanced, options as well, if the Heroku stuff is too limiting for you, but I won't go into that here. Since it's like Heroku, that also means you could host your database in Dokku if you wanted. But that's also not covered by this guide.

Beware that it's you, yourself, who is responsible for keeping your server secure and up-to-date. You have to figure out backups. What do you do if your page becomes super popular? How do you handle scaling? There are a thousand and one reasons to **not** self-host. [begin](https://begin.com) has a whole page dedicated to why you shouldn't do it. It's a pretty fun, and eye-opening read. Have a look: https://begin.com/learn/shit-youre-not-doing-with-begin

With that out of the way: let's get started!

To follow along you'll need an Ubuntu 20.04 box (or a recent version of Debian) where you have root access. The server needs to have at least 1 GB of RAM. You'll also need a domain you can configure DNS for. And finally, a suitable Redwood project to deploy. I have a small cloud server at [Hetzner](https://www.hetzner.com) and a domain that I bought through [Porkbun](https://porkbun.com). If you have a DigitalOcean droplet cloud server, or a Microsoft Azure server there are specific guides on Dokku's web page [1](https://dokku.com/docs/getting-started/install/digitalocean/) [2](https://dokku.com/docs/getting-started/install/azure/)

First thing to do is configure your domain to point to the IP address of your server. Make sure it's working by SSHing into your server. If this is a freshly installed OS, create a new user and make sure it's allowed to use the `sudo` command.

Install Dokku
```
wget https://raw.githubusercontent.com/dokku/dokku/v0.24.3/bootstrap.sh
sudo DOKKU_TAG=v0.24.3 bash bootstrap.sh
```
Go to yourdomain.com and finish the setup in your browser.

Create a new Dokku application (replace `my-redwood-app` with the actual name of your app).

```
dokku apps:create my-redwood-app
```

If you have a database connected to your app you'll want to set the `DATABASE_URL` environment variable.

```
dokku config:set my-redwood-app DATABASE_URL=postgresql://asldfjsldf
```

Now it's time to prepare your Redwood app for deploying to Dokku. You need to do two things:

1. Set `apiProxyPath = "/api"` in redwood.toml
2. Create a new file in the root of your project called `.buildpacks`. Add this content to that file
   ```
   https://github.com/tobbe/dokku-buildpack-redwood-init.git
   https://github.com/heroku/heroku-buildpack-nodejs.git
   https://github.com/heroku/heroku-buildpack-nginx.git
   https://github.com/tobbe/dokku-buildpack-redwood-finish.git
   ```

Now your app is ready. For the next step you'll need to have an ssh agent running, with your key loaded. If you're on Windows you might have to do this manually. These two commands worked for me in git-bash.

```
eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa
```

Now you can add dokku as a new remote to git, and push to deploy! 🚀

```
git remote add dokku dokku@yourdomain.com:my-redwood-app
git push dokku main
```

This will take a few minutes as it downloads and installs node.js, nginx, redwood and your other project dependencies etc. But in the end, when it's ready, you should be able to go to my-redwood-app.yourdomain.com and see your site live in your browser!

If you made it this far, and it works, congratulations! 🎉🏁

I bet a few of you who read this wonder what those github hosted buildpacks do that we added to the `.buildpacks` file. The first one is written by me, and it adds a few files to your Redwood app. Then we add nodejs and nginx. One of the files added in the first step is a config file for nginx. That's why the "redwood-init" buildpack needs to run first. Finally there's another Redwood specific buildpack that installs a few needed packages, builds Redwood and finally starts nginx and Redwood's api server.

🔒 Now that your Redwood app is live, I highly recommend setting up SSL for it, to make it more secure. I'm just going to link to [Dokku's SSL guide](https://dokku.com/docs/deployment/application-deployment/#setting-up-ssl). It's really easy to get Let's Encrypt setup.

<span style="font-size: 80%">(Header photo by <a href="https://unsplash.com/@some_random_guy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alex Duffy</a> on <a href="https://unsplash.com/s/photos/docks-containers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>)</span>
