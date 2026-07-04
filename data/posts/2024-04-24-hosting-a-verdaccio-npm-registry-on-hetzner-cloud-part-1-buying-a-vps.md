---
title: "Hosting a Verdaccio NPM Registry on Hetzner Cloud Part 1: Buying a VPS"
date: 2024-04-26
cover: /assets/server-rack-matthieu-beaumont-unsplash.webp
coverAlt: Cover image for the post. Storage server rack. Photo taken by Matthieu Beaumont.
---

As the title suggest, we're going to host this on a [Hetzner](https://www.hetzner.com) cloud server, a Virtual Private Server (VPS). If you already have a VPS you want to use you can [skip ahead to Part 2](https://tlundberg.com/hosting-a-verdaccio-npm-registry-on-hetzner-cloud-part-2-adding-a-user-and-securing-the-server) where we start configuring the server.

Start by going to [https://www.hetzner.com/cloud/](https://www.hetzner.com/cloud/) and signing up

![Hetzner's sign up page](/assets/hetzner-1-signup.png)

![Dropdown menu for selecting the cloud option](/assets/hetzner-1-dropdown-cloud.png)

Click the red "Sign Up" button, or "Login" in the top navigation bar and then "Cloud". Both buttons should take you to the screen below where you need to click "Register Now" and then fill in your email etc. It'll also ask for a credit card number, but you won't be charged yet.

![](/assets/hetzner-1-login-form.png)

Once you're through the registration process you should see something like this

![](/assets/hetzner-1-default-project.png)

Click "Create Server" and chose your desired location. Then pick Ubuntu 22.04 as your desired OS Image. For "Type" the cheapest option is absolutely good enough. So I went with a Shared Intel vCPU with 2 GB or RAM, 20 GB of disk space (SSD) and 20 TB of traffic (I wish I had that much traffic!).

![](/assets/hetzner-1-create-server.png)

To simplify things, and make sure my registry can be used by as many as possible, I also chose to pay for an IPv4 address. And I suggest you do the same.

Now it's time to add an SSH key. You don't have to, but as they say – it is recommended for security reasons. If you already have one you can go ahead and add it, otherwise you can generate a new one by pasting the text below into your terminal.

```bash
❯ ssh-keygen -t ed25519 -C "hetzner-verdaccio"
```

The output will look something like this

![](/assets/hetzner-1-ssh-keygen.png)

As you can see I also gave my key a custom name that matches the comment (`-C`) I passed to `ssh-keygen`, just to make it easier to identify. And you probably should use a passphrase, but for convenience I didn't this time 😬

Copy your public key. If you're on a MacOS computer you can do it like this:

```bash
❯ cat ~/.ssh/id_ed25519-hetzner-verdaccio.pub | pbcopy
```

Click "Add SSH key" on the server creation page and then paste your key into the form.

![](/assets/hetzner-1-add-ssh-key.png)

It'll parse the key for you and populate the Name field too. Choose "Set as default key" if you want and then click "Add SSH key". You should now see this

![](/assets/hetzner-1-added-ssh-key.png)

That's almost all we have to do. Now just scroll to the bottom and give your server a more descriptive name, like "verdaccio"

![](/assets/hetzner-1-server-name.png)

Finally click "Create & Buy now"

![](/assets/hetzner-1-create-and-buy.png)

After a few seconds you should see something like this

![](/assets/hetzner-1-server-list.png)

Copy your server's IP address by clicking on it. You'll need it to connect to your server from the terminal.

So open up a new terminal and enter `ssh -i ~/.ssh/id_ed25519-hetzner-verdaccio root@<IP-address>` where you replace `<IP-address>` with the address you copied from the Hetzner web interface. It'll ask you to confirm the fingerprint. Type `yes` and press Enter.

![](/assets/hetzner-1-terminal-root.png)

You're now logged into your very own Hetzner Cloud VPS!

## Conclusion

You've now bought a cloud computer on [Hetzner](https://www.hetzner.com). It's a very cheap Virtual Private Server (VPS) more than capable of hosting your own NPM registry and a few other things if you want. During setup we added an SSH key, so that you can login to the server and get root access without relying on potentially insecure passwords.

[Next up in Part 2](https://tlundberg.com/hosting-a-verdaccio-npm-registry-on-hetzner-cloud-part-2-adding-a-user-and-securing-the-server) we're going to create a regular user (not root) and make the server more secure.

---

Cover Photo by [Matthieu Beaumont](https://unsplash.com/@matthieu_cabri?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/a-very-large-array-of-electronic-equipment-in-a-room-iYnpYeyu57k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
