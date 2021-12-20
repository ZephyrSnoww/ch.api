/**
 * Convert a user object from a given client into a normalized object.
 * @param {Object} user - The user to normalize
 * @param {Object} client - The client the user is from
 * @returns {Object}
 */
 exports.NormalizeUser = async (user, client) => {
    let normalizedUser = {
        avatar: null,
        banner: null,
        bot: false,
        client: client.client,
        createdAt: new Date(),
        discriminator: null,
        id: 0,
        username: null,
        originalUser: user
    };

    if (client.name === "Telegram") {
        normalizedUser.avatar = null; // TODO
        normalizedUser.banner = null; // TODO
        normalizedUser.bot = user.is_bot;
        normalizedUser.createdAt = null; // TODO
        normalizedUser.discriminator = null; // TODO?
        normalizedUser.id = user.id;
        normalizedUser.username = user.username;
    }

    if (client.name === "Discord") {
        normalizedUser.avatar = user.avatarURL();
        normalizedUser.banner = user.bannerURL();
        normalizedUser.bot = user.bot;
        normalizedUser.createdAt = user.createdAt;
        normalizedUser.discriminator = user.discriminator;
        normalizedUser.id = user.id;
        normalizedUser.username = user.username;
    }

    if (client.name === "Revolt") {
        normalizedUser.avatar = user.generateAvatarURL();
        normalizedUser.banner = user.fetchProfile();
        normalizedUser.bot = user.bot;
        normalizedUser.createdAt = user.createdAt;
        normalizedUser.discriminator = null; // TODO?
        normalizedUser.id = user._id;
        normalizedUser.username = user.username;
    }

    return normalizedUser;
}