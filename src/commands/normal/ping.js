const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["pong"],
  cooldown: 5000,
  run: async (client, message, args) => {
      message.reply(`Pong 🏓`)
    }
 };
