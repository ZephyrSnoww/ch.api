const EventEmitter = require("events");

const TelegramBot = require("node-telegram-bot-api");
const Discord = require("discord.js");
const Revolt = require("revolt.js");

const { NormalizeMessage } = require("./util/NormalizeMessage");

/**
 * The main client for interfacing with all other services.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
    /**
     * @param {Object} options - Options for each client to instantiate
     * @param {string} options.prefix - A prefix for the bot to use
     * @param {string[]} [options.discordIntents] - Intents for the Discord client to use (defaults to all)
     */
    constructor({
        prefix = undefined,
        discordIntents = Object.values(Discord.Intents.FLAGS)
    }) {
        super();

        if (prefix === undefined) {
            throw new Error("A bot prefix must be given");
        }

        this.clients = {};
        this.prefix = prefix;

        this.clients.telegram = {
            name: "Telegram",
            client: null
        };

        this.clients.discord = {
            name: "Discord",
            client: new Discord.Client({ intents: [discordIntents] })
        };

        this.clients.revolt = {
            name: "Revolt",
            client: new Revolt.Client()
        };
    }

    /**
     * Logs in all clients given, making them ready for use.
     * @param {Object} options - All options to use to login each client
     * @param {string} [options.telegramToken = null] - The token to use to log into Telegram
     * @param {string} [options.discordToken = null] - The token to use to log into Discord
     * @param {string} [options.revoltToken = null] - The token to use to log into Revolt
     */
    async login({
        telegramToken = null,
        discordToken = null,
        revoltToken = null
    }) {
        this.tokens = {
            telegramToken,
            discordToken,
            revoltToken
        };
        
        if (Object.values(this.tokens).every(token => token == null)) {
            throw new Error("At least one API token must be given");
        }

        // TODO: Teamspeak login?
        // TODO: Skype login?
        // TODO: SMS login

        // Telegram login
        if (this.tokens.telegramToken != null) {
            this.clients.telegram.client = new TelegramBot(this.tokens.telegramToken, {
                polling: true
            });

            this.clients.telegram.client.on("message", async (message) => await this.handleMessage(message, this.clients.telegram));
            await this.handleReady(this.clients.telegram);
        }

        // Discord login
        if (this.tokens.discordToken != null) {
            this.clients.discord.client.login(discordToken);
            this.clients.discord.client.on("messageCreate", async (message) => await this.handleMessage(message, this.clients.discord));
            this.clients.discord.client.on("ready", async () => await this.handleReady(this.clients.discord));
        }

        // Revolt login
        if (this.tokens.revoltToken != null) {
            this.clients.revolt.client.loginBot(revoltToken);
            this.clients.revolt.client.on("message", async (message) => await this.handleMessage(message, this.clients.revolt));
            this.clients.revolt.client.on("ready", async () => await this.handleReady(this.clients.revolt));
        }
    }

    /**
     * Called when a message is recieved from a client
     * @param {Object} message - The message recieved
     * @param {Object} client - The client sending the event 
     */
    async handleMessage(message, client) {
        this.emit("message", await NormalizeMessage(message, client), client);
    }

    /**
     * Called when a client is ready
     * @param {Object} client - The client sending the event
     */
    async handleReady(client) {
        this.emit("ready", client);
    }
}

module.exports = Client;