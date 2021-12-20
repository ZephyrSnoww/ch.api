# ch.api.js

Chat Application Programming Interface, or ch.api.js, is a package built to connect chat applications. Think of it as [Discord.js](https://www.npmjs.com/package/discord.js), but built to work not only on Discord, but Revolt, Telegram, and more.

## Installation

```bash
npm install ch.api.js
```

## Example Usage

```js
const { Client } = require("ch.api.js");
const config = require("./config.json");

// Using {} gives us all Discord intents.
// Use { discordIntents: [] } if you want specific intents.
// ch.api.js has Discord intents built in, in the form of the discordIntents object.
const client = new Client({});

// The "ready" event is called whenever a client is ready.
// This means that it gets called once for Discord, once for Revolt, once for Telegram, etc.
client.on("ready", (client) => {
    console.log(`Logged into ${client.name.toUpperCase()}!`);
});

client.on("message", async (message, client) => {
    console.log(`${client.name} message: ${message.author.username} said "${message.content}"`);
});

// This logs into any clients that have a token supplied.
client.login({
    telegramToken: config.tokens.telegram,
    discordToken: config.tokens.discord,
    revoltToken: config.tokens.revolt
});
```

---

## Support

### Support Server Invites

[Telegram Support Server](https://t.me/+32NeAwwbGXJmODYx)

[Discord Support Server](https://discord.gg/E4dgsytzRs)

[Revolt Support Server](https://app.revolt.chat/invite/dFeJfhf0)

### Bot Invites

[Telegram Bot Invite](http://t.me/ch_ai_bot)

[Discord Bot Invite](https://discord.com/api/oauth2/authorize?client_id=908220543558381588&permissions=8&scope=bot)

[Revolt Bot Invite](https://app.revolt.chat/bot/01FM6NHPY1DB31RCPDSBHD1M2J)
