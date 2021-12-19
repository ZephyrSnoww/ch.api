const Discord = require("discord.js");

exports.Client = require("./Client");

exports.NormalizeChannel = require("./util/NormalizeChannel");
exports.NormalizeMember = require("./util/NormalizeMember");
exports.NormalizeMessage = require("./util/NormalizeMessage");
exports.discordIntents = Discord.Intents;