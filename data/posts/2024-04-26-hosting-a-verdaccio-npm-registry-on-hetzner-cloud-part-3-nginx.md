---
title: "Hosting a Verdaccio NPM Registry on Hetzner Cloud Part 3: nginx"
date: 2024-04-26
canonicalUrl: https://tlundberg.com/blog/2024-04-26-hosting-a-verdaccio-npm-registry-on-hetzner-cloud-part-3-nginx
cover: /assets/server-rack-wires-taylor-vick-unsplash.jpg
coverAlt: Cover image for the post. Server rack with wires. Photo taken by Taylor Vick.
---

To follow along here you're going to need a (sub-)domain you want to use to access your [Verdaccio](https://verdaccio.org) NPM Registry. I already have a tobbe.dev domain, so I used a subdomain for this, [pistachio.tobbe.dev](https://pistachio.tobbe.dev), and pointed it to my new server IP.

## Login and update

If you've followed along with Part 1 and Part 2 your server should be secure. Let's make sure it's also up to date!

```plaintext
pistachio@verdaccio:~$ sudo apt-get update && sudo apt-get upgrade
```

Answer Yes if/when it asks if you want to continue

If it asks about your sshd\_config file, you want to keep your locally modified version. Press Tab to highlight &lt;Ok&gt; and then press Enter to continue

![](/assets/hetzner-3-openssh-keep-local.png)

Following that it might ask about daemons using outdated libraries. Again, press Tab to highlight &lt;Ok&gt; and then press Enter to continue.

## nginx installation

```plaintext
pistachio@verdaccio:~$ sudo apt install nginx
```

Again, it might ask you about daemons using outdated libraries. Select all of them and then continue

![](/assets/hetzner-3-daemons-restart.png)

Remember that firewall we configured before? It's blocking access to nginx, so we need to update its config.

```plaintext
pistachio@verdaccio:~$ sudo ufw app list
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

You might be tempted to go with HTTPS only, but we need HTTP to be able to verify our SSL setup later. Plus we will tell nginx to redirect all HTTP traffic to HTTPS, so we're going to allow "Nginx Full".

```plaintext
pistachio@verdaccio:~$ sudo ufw allow 'Nginx Full'
Rule added
Rule added (v6)
```

Check the firewall status

```plaintext
pistachio@verdaccio:~$ sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
```

You should now be able to access your web server in your browser by going to http://&lt;IP-address&gt;

![](/assets/hetzner-3-nginx-welcome.png)

Depending on your domain/DNS you might also be able to access it using [http://your.domain.tld](http://your.domain.tld) but since I'm using a .dev top level domain (TLD) I can't, because they require SSL

## SSL

Certbot will manage our SSL certificates.

```plaintext
pistachio@verdaccio:~$ sudo apt install certbot python3-certbot-nginx
```

```plaintext
pistachio@verdaccio:~$ sudo certbot --nginx -d pistachio.tobbe.dev
```

And this is the output you want

![](/assets/hetzner-3-certbot.png)

Let's take a look at the default nginx config

```plaintext
pistachio@verdaccio:~$ sudo less /etc/nginx/sites-available/default
```

![](/assets/hetzner-3-nginx-config.png)

You'll see a bunch of lines with `# managed by Certbot` at the end. Those were added thanks to the `--nginx` command line option we used when we ran the `certbot` command. The file is a bit messy with commented config, indentation a bit all over the place etc. But we'll create our own config soon, and make sure to clean it up so it's easier to follow along with what's going on.

For now we should just make sure it all works by going to [https://pistachio.tobbe.dev](https://verdaccio.tobbe.dev) in our web browser.

## Conclusion

This was a pretty short part. We installed nginx and configured it to use SSL. We also verified that we could now access our web server using https. We'll come back to the nginx config, but first we need to install [Verdaccio](https://verdaccio.org), and that's exactly what we'll do in [the next part of this guide](https://tlundberg.com/hosting-a-verdaccio-npm-registry-on-hetzner-cloud-part-4-verdaccio).

<span style="font-size: 80%">(Cover Photo by <a href="https://unsplash.com/@tvick?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Taylor Vick</a> on <a href="https://unsplash.com/photos/cable-network-M5tzZtFCOfs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>)</span>
