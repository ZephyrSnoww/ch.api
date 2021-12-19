const { NormalizeServer } = require("./NormalizeServer");

/**
 * Convert a channel object from a given client into a normalized object.
 * @param {Object} channel - The channel to normalize
 * @param {Object} client - The client the given channel is from
 * @returns {Object}
 */
exports.NormalizeChannel = (channel, client) => {
    let normalizedChannel = {
        client: client.client,
        createdAt: new Date(),
        deletable: false,
        description: null,
        server: null,
        serverId: 0,
        id: 0,
        name: null,
        nsfw: false,
        originalChannel: channel
    };

    if (client.name === "Telegram") {
        normalizedChannel.createdAt = null;
        normalizedChannel.deletable = null;
        normalizedChannel.description = channel.description || channel.bio;
        normalizedChannel.serverId = channel.id;
        normalizedChannel.id = channel.id;
        normalizedChannel.name = channel.title || channel.username;
        normalizedChannel.nsfw = false;

        normalizedChannel.server = NormalizeServer(channel, client);
    }

    if (client.name === "Discord") {
        normalizedChannel.createdAt = channel.createdAt;
        normalizedChannel.deletable = channel.deletable;
        normalizedChannel.description = channel.topic;
        normalizedChannel.serverId = channel.guildId;
        normalizedChannel.id = channel.id;
        normalizedChannel.name = channel.name;
        normalizedChannel.nsfw = channel.nsfw;

        normalizedChannel.server = NormalizeServer(channel.guild, client);
    }

    if (client.name === "Revolt") {
        normalizedChannel.createdAt = channel.createdAt;
        normalizedChannel.deletable = false; // TODO
        normalizedChannel.description = channel.description;
        normalizedChannel.serverId = channel.server_id;
        normalizedChannel.id = channel._id;
        normalizedChannel.name = channel.name;
        normalizedChannel.nsfw = channel.nsfw;

        normalizedChannel.server = NormalizeServer(channel.server, client);
    }

    return normalizedChannel;
}