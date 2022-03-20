/**
 * Convert a server from a given client into a normalized object.
 * @param {Object} server - The server to normalize
 * @param {Object} client - The client the server is from
 * @returns {Object}
 */
let NormalizeServer = async (server, client) => {
    let normalizedServer = {
        icon: null,
        banner: null,
        client: client.client,
        createdAt: new Date(),
        description: null,
        id: 0,
        name: null,
        ownerId: 0,

        edit: () => { return null; },
        leave: () => { return null; },
        setBanner: () => { return null; },
        setIcon: () => { return null; },
        setName: () => { return null; },

        originalServer: server
    };

    if (client.name === "Telegram") {
        normalizedServer.icon = (server.photo === undefined) ? null : server.photo.big_file_id;
        normalizedServer.banner = null;
        normalizedServer.createdAt = null;
        normalizedServer.description = server.description || server.bio;
        normalizedServer.id = server.id;
        normalizedServer.name = server.title || server.username;
        normalizedServer.ownerId = null;
    }

    if (client.name === "Discord") {
        normalizedServer.icon = server.iconURL();
        normalizedServer.banner = server.bannerURL();
        normalizedServer.createdAt = server.createdAt;
        normalizedServer.description = server.description;
        normalizedServer.id = server.id;
        normalizedServer.name = server.name;
        normalizedServer.ownerId = server.ownerId;
    }

    if (client.name === "Revolt") {
        normalizedServer.icon = server.generateIconURL();
        normalizedServer.banner = server.generateBannerURL();
        normalizedServer.createdAt = server.createdAt;
        normalizedServer.description = server.description;
        normalizedServer.id = server._id;
        normalizedServer.name = server.name;
        normalizedServer.ownerId = server.owner;
    }

    return normalizedServer;
}

exports.NormalizeServer = NormalizeServer;