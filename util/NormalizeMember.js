const { NormalizeServer } = require("./NormalizeServer");
const { NormalizeUser } = require("./NormalizeUser");

/**
 * Convert a member object from a given client into a normalized object.
 * @param {Object} member - The member to normalize
 * @param {Object} client - The client the member is from
 * @returns {Object}
 */
let NormalizeMember = async (member, client) => {
    let normalizedMember = {
        avatar: null,
        client: client.client,
        server: null,
        id: 0,
        nickname: null,
        user: null,
        originalMember: member
    };

    if (member === null) {
        return null;
    }

    if (client.name === "Telegram") {
        normalizedMember.avatar = null; // TODO
        normalizedMember.id = member.id;
        normalizedMember.nickname = member.username;
        normalizedMember.server = null;

        normalizedMember.user = await NormalizeUser(member, client);
    }

    if (client.name === "Discord") {
        normalizedMember.avatar = member.avatarURL();
        normalizedMember.id = member.id;
        normalizedMember.nickname = member.nickname;

        normalizedMember.server = await NormalizeServer(member.guild, client);

        let user = await member.user.fetch()
        normalizedMember.user = await NormalizeUser(user, client);
    }

    if (client.name === "Revolt") {
        normalizedMember.avatar = member.generateAvatarURL();
        normalizedMember.id = member._id;
        normalizedMember.nickname = member.nickname;

        normalizedMember.user = await NormalizeUser(member.user, client);
        normalizedMember.server = await NormalizeServer(member.server, client);
    }

    return normalizedMember;
}

exports.NormalizeMember = NormalizeMember;