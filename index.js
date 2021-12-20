const Discord = require("discord.js");

exports.Client = require("./Client");

exports.NormalizeAttachments = require("./util/NormalizeAttachments");
exports.NormalizeChannel = require("./util/NormalizeChannel");
exports.NormalizeMember = require("./util/NormalizeMember");
exports.NormalizeMessage = require("./util/NormalizeMessage");
exports.NormalizeServer = require("./util/NormalizeServer");
exports.NormalizeUser = require("./util/NormalizeUser");

exports.discordIntents = Discord.Intents;