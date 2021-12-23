const { NormalizeServer } = require("./NormalizeServer");

/**
 * Convert a channel object from a given client into a normalized object.
 * @param {Object} channel - The channel to normalize
 * @param {Object} client - The client the given channel is from
 * @returns {Object}
 */
let NormalizeChannel = async (channel, client) => {
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

        send: () => { return null; },
        setName: () => { return null; },
        setTopic: () => { return null; },

        originalChannel: channel
    };

    if (client.name === "Telegram") {
        normalizedChannel.createdAt = null;
        normalizedChannel.deletable = false;
        normalizedChannel.description = channel.description || channel.bio;
        normalizedChannel.serverId = channel.id;
        normalizedChannel.id = channel.id;
        normalizedChannel.name = channel.title || channel.username;
        normalizedChannel.nsfw = false;

        normalizedChannel.server = await NormalizeServer(channel, client);

        normalizedChannel.send = (content) => client.client.sendMessage(channel.id, content);
        normalizedChannel.setName = (name) => client.client.setChatTitle(channel.id, name);
        normalizedChannel.setTopic = (topic) => client.client.setChatDescription(channel.id, topic);
    }

    if (client.name === "Discord") {
        normalizedChannel.createdAt = channel.createdAt;
        normalizedChannel.deletable = channel.deletable;
        normalizedChannel.description = channel.topic;
        normalizedChannel.serverId = channel.guildId;
        normalizedChannel.id = channel.id;
        normalizedChannel.name = channel.name;
        normalizedChannel.nsfw = channel.nsfw;

        normalizedChannel.server = await NormalizeServer(channel.guild, client);

        normalizedChannel.send = (content) => channel.send(content);
        normalizedChannel.setName = (name) => channel.setName(name);
        normalizedChannel.setTopic = (topic) => channel.setTopic(topic);
    }

    if (client.name === "Revolt") {
        normalizedChannel.createdAt = channel.createdAt;
        normalizedChannel.deletable = false; // TODO
        normalizedChannel.description = channel.description;
        normalizedChannel.serverId = channel.server_id;
        normalizedChannel.id = channel._id;
        normalizedChannel.name = channel.name;
        normalizedChannel.nsfw = channel.nsfw;

        normalizedChannel.server = await NormalizeServer(channel.server, client);

        normalizedChannel.send = (content) => channel.sendMessage(content);
        normalizedChannel.setName = (name) => channel.edit({ name: name });
        normalizedChannel.setTopic = (topic) => channel.edit({ description: topic });
    }

    return normalizedChannel;
}

exports.NormalizeChannel = NormalizeChannel;