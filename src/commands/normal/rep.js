const { MessageEmbed, Permissions } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "rep",
  aliases: ["repu"],
  cooldown: 5000,
  run: async (client, message, args) => {
      if (message.channel?.type === 'DM') {
    await message.reply('This command cannot be executed in a DM.');
    return;
  }
    let rep = await db.get(`rep_${message.guild.id}`)

    if(rep === null){
      let embed = new MessageEmbed()
        .setDescription("🔵 Fetching database...")
        .setColor("YELLOW")
       let msg = await message.reply({ embeds: [embed] })
      setTimeout(async () => {
        let embeds = new MessageEmbed()
      .setDescription("🟢 Database successfully setted!")
      .setColor("GREEN")
        db.add(`rep_${message.guild.id}`, 1)
      return await msg.edit({ embeds: [embeds] })
      }, 10000)
    } 
    if(rep){ 
    let reped = new MessageEmbed()
    .setTitle("📥 | New reputation!")
    .setDescription(`You gave +1 rep to the owner of the server! | Now the owner have **${rep}**.`)
    .setColor("BLUE")

    db.add(`rep_${message.guild.id}`, 1)
    return message.channel.send({ embeds: [reped] })
    }
    }
 };