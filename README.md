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
    console.log(`Logged into ${client.toUpperCase()}!`);
});

client.on("message", (message, client) => {
    console.log(`${client} message: ${message.author} said "${message.content}"`);
    if (message.content === "ch.ping") {
        message.reply("Pong!");
    }
});

// This logs into any clients that have a token supplied.
client.login({
    discordToken: config.tokens.discord,
    revoltToken: config.tokens.revolt
});
```
