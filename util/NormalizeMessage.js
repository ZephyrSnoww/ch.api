const { NormalizeAttachment } = require("./NormalizeAttachment");
const { NormalizeUser } = require("./NormalizeUser");
const { NormalizeChannel } = require("./NormalizeChannel");
const { NormalizeMember } = require("./NormalizeMember");
const { NormalizeServer } = require("./NormalizeServer");

/**
 * Convert a message object from a given client into a normalized object.
 * @param {Object} message - The message to normalize
 * @param {Object} client  - The client the message is from
 * @returns {Object}
 */
exports.NormalizeMessage = (message, client) => {
    let normalizedMessage = {
        attachments: [],
        author: null,
        channel: null,
        channelId: 0,
        client: client.client,
        content: null,
        createdAt: new Date(),
        deletable: false,
        editable: false,
        editedAt: null,
        embeds: [],
        server: null,
        serverId: 0,
        id: 0,
        member: null,
        originalMessage: message
    };

    if (client.name === "Telegram") {
        normalizedMessage.attachments = [message.document]; // Normalize
        normalizedMessage.channelId = message.chat.id;
        normalizedMessage.content = message.text;
        normalizedMessage.createdAt = new Date(message.date);
        normalizedMessage.deletable = false;
        normalizedMessage.editable = false;
        normalizedMessage.editedAt = message.edit_date;
        normalizedMessage.serverId = message.chat.id;
        normalizedMessage.id = message.message_id;

        normalizedMessage.member = NormalizeMember(message.from, client);
        normalizedMessage.author = NormalizeUser(message.from, client);

        client.client.getChat(message.chat.id).then(chat => {
            normalizedMessage.channel = NormalizeChannel(chat, client);
            normalizedMessage.server = NormalizeServer(chat, client);
        });
    }

    if (client.name === "Discord") {
        normalizedMessage.attachments = message.attachments; // Normalize
        normalizedMessage.channelId = message.channelId;
        normalizedMessage.content = message.content;
        normalizedMessage.createdAt = message.createdAt;
        normalizedMessage.deletable = message.deletable;
        normalizedMessage.editable = message.editable;
        normalizedMessage.editedAt = message.editedAt;
        normalizedMessage.serverId = message.guildId;
        normalizedMessage.id = message.id;

        normalizedMessage.author = NormalizeUser(message.author, client);
        normalizedMessage.channel = NormalizeChannel(message.channel, client);
        normalizedMessage.server = NormalizeServer(message.guild, client);
        normalizedMessage.member = NormalizeMember(message.member, client);
    }

    if (client.name === "Revolt") {
        normalizedMessage.attachments = message.attachments; // Normalize
        normalizedMessage.channelId = message.channel_id;
        normalizedMessage.content = message.content;
        normalizedMessage.createdAt = message.createdAt;
        normalizedMessage.deletable = false;
        normalizedMessage.editable = false;
        normalizedMessage.editedAt = message.edited;
        normalizedMessage.serverId = message.channel.server._id;
        normalizedMessage.id = message._id;

        normalizedMessage.author = NormalizeUser(message.author, client);
        normalizedMessage.channel = NormalizeChannel(message.channel, client);
        normalizedMessage.server = NormalizeServer(message.channel.server, client);
        normalizedMessage.member = NormalizeMember(message.member, client);
    }

    return normalizedMessage;
}