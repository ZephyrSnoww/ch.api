const EventEmitter = require("events");

const TelegramBot = require("node-telegram-bot-api");
const Discord = require("discord.js");
const Revolt = require("revolt.js");

/**
 * The main client for interfacing with all other services.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
    /**
     * @param {Object} options - Options for each client to instantiate
     * @param {string[]} [options.discordIntents] - Intents for the Discord client to use
     */
    constructor({
        discordIntents = Object.values(Discord.Intents.FLAGS)
    }) {
        super();

        this.clients = {};

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
    login({
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

            this.clients.telegram.client.on("message", (message) => this.handleMessage(message, this.clients.telegram));
            this.handleReady(this.clients.telegram);
        }

        // Discord login
        if (this.tokens.discordToken != null) {
            this.clients.discord.client.login(discordToken);
            this.clients.discord.client.on("messageCreate", (message) => this.handleMessage(message, this.clients.discord));
            this.clients.discord.client.on("ready", () => this.handleReady(this.clients.discord));
        }

        // Revolt login
        if (this.tokens.revoltToken != null) {
            this.clients.revolt.client.loginBot(revoltToken);
            this.clients.revolt.client.on("message", (message) => this.handleMessage(message, this.clients.revolt));
            this.clients.revolt.client.on("ready", () => this.handleReady(this.clients.revolt));
        }
    }

    /**
     * Called when a message is recieved from a client
     * @param {Object} message - The message recieved
     * @param {Object} client - The client sending the event 
     */
    handleMessage(message, client) {
        this.emit("message", message, client);
    }

    /**
     * Called when a client is ready
     * @param {Object} client - The client sending the event
     */
    handleReady(client) {
        this.emit("ready", client);
    }
}

module.exports = Client;