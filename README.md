<h1 align="center">
  <br>
  <a href="https://github.com/JamesAUre/ClanCastleBot"><img src="https://i.imgur.com/ozfC7Gy.png" width="100" height="100" alt="Clan Castle"></a>
  <br>
  Wizard
  <br>
</h1>
<h4 align="center">The ultimate Clash of Clans Discord stat tracker.</h4>
<p align="center">
  <a href="#overview">Overview</a>
  •
  <a href="#join-the-community">Community</a>
  •
  <a href="#how-to-create-new-instance">Make new instance</a>
  •
  <a href="#authors">Authors</a>
  •
  <a href="#license">License</a>
</p>

# Overview

Wizard is a Discord bot that tracks your Clash of Clans stats and lets you show them off on Discord. This is a single instance bot meaning it's hosted on one machine and invitable to any server. But you can also maintain your own instance if you wish.

Installation is easy, all you need to do is invite the bot to your server and use `/setconfiguration` to specify the bot configuration for it to run properly on the server. In the future this will be moved onto a website.

**This bot includes the following:**

- Posting player stats
- Posting clan stats
- Verifying profiles
- Setting achievement roles
- Competing on community leaderboards

We plan to expand and improve existing functionality in the future as well.

# Join the community!

This bot was originally intended for usage in the Clash of Clans Discord server, a community server that is officially affiliated with Supercell. This bot is still in production and new features will be added in the future. Our community covers various aspects of the game such as recruitment, strategy, talks with Supercell and general community discussion!

Join us at the [Clash of Clans Discord Server](https://discord.com/invite/clashofclans)!

# How to create a new instance

Directions on creating an app and getting credentials may be found [here](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).

Invite your bot to your server, make sure you select the `bot` and `applications.commands` options while creating the invite.

Get your Clash of Clans API Token from [here](https://developer.clashofclans.com/).

## Setting up

1. Clone this repository

2. Make a copy of `.env.copy` and rename it to `.env`.
   Fill in your Discord Token, your Mongo_URI and your Clash Token. Make sure you include Bearer before your clash token like `"Bearer eyJ0eXAiOiJKV..."`

3. Make a copy of the `config.json.copy` file and rename it to `config.json`. Then go to the `config.json` file and change all the ids to ids in your server.

4. Do the same with `emojis.json.copy`, you can set emojis for the bot on the Discord Developer Portal

## Installation

Install all the dependencies using

```bash
npm install
```

Register slash commands to a single guild by running

```bash
node deploy-commands.js
```

You only need to run `node deploy-commands.js` once. You should only run it again if you add or edit existing commands

Finally start the application using

```bash
node index
```

# Authors

- [@Azer](https://www.github.com/JamesIsAzer)
- [@Hawk Eye](https://github.com/hawkeye7662)

# License

[MIT](https://choosealicense.com/licenses/mit/)