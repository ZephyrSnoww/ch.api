// const { NormalizeAttachment } = require("./NormalizeAttachment");
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
exports.NormalizeMessage = async (message, client) => {
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

        reply: null,

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

        normalizedMessage.member = await NormalizeMember(message.from, client);
        normalizedMessage.author = await NormalizeUser(message.from, client);

        let chat = await client.client.getChat(message.chat.id);

        normalizedMessage.channel = await NormalizeChannel(chat, client);
        normalizedMessage.server = await NormalizeServer(chat, client);

        normalizedMessage.reply = (content) => client.client.sendMessage(message.chat.id, content, { reply_to_message_id: message.message_id} );
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

        normalizedMessage.channel = await NormalizeChannel(message.channel, client);
        normalizedMessage.server = await NormalizeServer(message.guild, client);
        normalizedMessage.member = await NormalizeMember(message.member, client);

        try {
            let user = await message.author.fetch();
            normalizedMessage.author = await NormalizeUser(user, client);
        } catch (e) {
            normalizedMessage.author = null;
        }

        normalizedMessage.reply = (content) => message.reply(content);
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

        normalizedMessage.author = await NormalizeUser(message.author, client);
        normalizedMessage.channel = await NormalizeChannel(message.channel, client);
        normalizedMessage.server = await NormalizeServer(message.channel.server, client);
        normalizedMessage.member = await NormalizeMember(message.member, client);

        normalizedMessage.reply = (content) => message.reply(content);
    }

    return normalizedMessage;
}