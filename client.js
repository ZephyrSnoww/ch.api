const EventEmitter = require("events");
const Discord = require("discord.js");
const Revolt = require("revolt.js");

/**
 * The main client for interfacing with all other services.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
    /**
     * @param {Object} options - Options for each client to instantiate
     * @param {string[]} options.discordIntents - Intents for the Discord client to use
     */
    constructor({
        discordIntents = Object.values(Discord.Intents.FLAGS)
    }) {
        super();
        this.clients = {};
        this.clients.discord = new Discord.Client({ intents: [discordIntents] });
        this.clients.revolt = new Revolt.Client();
    }

    /**
     * Logs in all clients given, making them ready for use.
     * @param {Object} options - All options to use to login each client
     * @param {string} [options.discordToken = null] - The token to use to log into Discord
     * @param {string} [options.revoltToken = null] - The token to use to log into Revolt
     */
    login({
        discordToken = null,
        revoltToken = null
    }) {
        this.tokens = {
            discordToken,
            revoltToken
        };
        
        if (Object.values(this.tokens).every(token => token == null)) {
            throw new Error("At least one API token must be given");
        }

        // TODO: Teamspeak login?
        // TODO: Telegram login
        // TODO: Skype login?
        // TODO: SMS login

        // Discord login
        if (this.tokens.discordToken != null) {
            this.clients.discord.login(discordToken);
            this.clients.discord.on("messageCreate", (message) => this.handleMessage(message, "discord"));
            this.clients.discord.on("ready", () => this.handleReady("discord"));
        }

        // Revolt login
        if (this.tokens.revoltToken != null) {
            this.clients.revolt.loginBot(revoltToken);
            this.clients.revolt.on("message", (message) => this.handleMessage(message, "revolt"));
            this.clients.revolt.on("ready", () => this.handleReady("revolt"));
        }
    }

    /**
     * Called when a message is recieved from a client
     * @param {Object} message - The message recieved
     * @param {string} client - The client sending the event 
     */
    handleMessage(message, client) {
        this.emit("message", message, client);
    }

    /**
     * Called when a client is ready
     * @param {string} client - The client sending the event
     */
    handleReady(client) {
        this.emit("ready", client);
    }
}

module.exports = Client;