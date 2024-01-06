const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu, Modal, TextInputComponent, ActionRowBuilder, TextInputBuilder, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const discordModals = require('discord-modals'); // Define the discord-modals package!

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-panel")
    .setDescription("Setup a shopping list in your server."),
    //  guide: https://v13.discordjs.guide/interactions/slash-commands.html#options
    run: async (client, interaction) => {
      discordModals(client);
      
  if (interaction.channel?.type === 'DM') {
    await interaction.reply('This command cannot be executed in a DM.');
    return;
  }
       const member = interaction.member;
      
      if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("No permission found in your profile")
      

      let setup = new MessageEmbed()
      .setTitle(`🤖 ${client.user.username} | Setup panel`)
      .setDescription("Hey there! You are currently using the setup panel which is only be seen by you, to complete the setup, select an option and give the following details.\nTo setup `!rep` command, do **!rep** first before using it.")
      .setColor("BLUE")
      //.setFooter(`Setup panel requested by ${interaction.author}`)
     const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('menu_dropdown')
          .setPlaceholder('Pick an option')
          .addOptions([
            {
              label: '🛍 | Create shopping list',
              description: 'Everyone is able to see the shopping list and react to it.',
              value: 'option_1',
            },
            {
              label: '🛎 | Create a customer role',
              description: 'This role is given when user purchased goods.',
              value: 'option_2',
            },
            {
              label: '📨 | Setup-ticket-support',
              description: 'Setup ticket in a specific channel',
              value: 'option_3',
            },
          ])
      );

    await interaction.reply({ embeds: [setup], components: [row], ephemeral: true});

      // start of modal
      const modal = new Modal()
      .setCustomId('modal')
      .setTitle('Setup Shopping List')
      .addComponents(
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('channel-id')
            .setLabel('Channel ID')
            .setStyle('SHORT')
            .setPlaceholder('12345678')
            .setRequired(true)
        ),
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('item-name')
            .setLabel('Item Name')
            .setStyle('SHORT')
            .setPlaceholder('Dirt')
            .setRequired(true)
        ),
        
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('item-price')
            .setLabel('Item price')
            .setStyle('SHORT')
            .setPlaceholder('$1')
            .setRequired(true)
        ),
      
      new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('item-detail')
            .setLabel('Item details')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Input item detail')
            .setRequired(true)
        ),

        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('item-embed')
            .setLabel('Send embed')
            .setStyle('SHORT')
            .setPlaceholder('Yes or No')
            .setRequired(true)
        ),
      );
      // end of modal

      client.on("interactionCreate", async interaction => {
  if (!interaction.isSelectMenu()) return;
        //if (!interaction.isMessageComponent()) return;

  if (interaction.customId === 'menu_dropdown') {
    const selectedValue = interaction.values[0];

    // Perform actions based on the selected value
    if (selectedValue === 'option_1') {
      // start
      
      await interaction.showModal(modal);
      // end
    }else if(selectedValue === 'option_2'){
      const guild = interaction.guild;
    //const roleName = interaction.options.getString('role-name');
    //const roleColor = interaction.options.getString('role-color');

    try {
      const role = await guild.roles.create({
        name: "🛒 | Customer",
        color: "#00FF00",
      });
      
      let rolec = new MessageEmbed()
      .setTitle("📝 | Created a customer role!")
      .setDescription(`Role ${role.name} created with color ${role.hexColor}!`)
      .setColor("GREEN")

      await interaction.reply({ embeds: [rolec]});
    } catch (error) {
      console.error('Failed to create role:', error);
      await interaction.reply('Failed to create role.');
    }

    }else if(selectedValue === 'option_3'){
      await interaction.showModal(modal2);
    }
  }
    })
// submission2
      // new modal v2
      const modal2 = new Modal()
      .setCustomId('modal2')
      .setTitle('Setup Ticket Support')
      .addComponents(
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cid')
            .setLabel('Channel ID')
            .setStyle('SHORT')
            .setPlaceholder('12345678')
            .setRequired(true)
        ),
                new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('category-id')
            .setLabel('Category ID')
            .setStyle('SHORT')
            .setPlaceholder('12345678')
            .setRequired(true)
        ),
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('role-id')
            .setLabel('Support role ID')
            .setStyle('SHORT')
            .setPlaceholder('12345678')
            .setRequired(true)
        ),
        
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('details')
            .setLabel('Description')
            .setStyle('PARAGRAPH')
            .setPlaceholder('This is a description for your ticket embed')
            .setRequired(false)
          ),
      );
      client.on("interactionCreate", async (interaction) => { 
      
                   if (interaction.isModalSubmit()) {
    if (interaction.customId === 'modal2') {
      const channel_id = interaction.fields.getTextInputValue('cid');
      const support_id = interaction.fields.getTextInputValue('role-id');
      let description = interaction.fields.getTextInputValue('details');

      if(!description) description = " Click the button to create a ticket. And wait till server staff handle it."

      // Replace 'CHANNEL_ID' with the actual channel ID where you want to send the message
    const channelId = channel_id;

    // Find the channel using the channel ID
    const channel = await client.channels.fetch(channelId);

    const role = interaction.guild.roles.cache.get(support_id);
    if (!role) {
      interaction.reply('The provided role ID does not exist.');
      return await interaction.deferUpdate();
    }
      let ticketembed = new MessageEmbed()
      .setTitle(`📩 ${interaction.guild.name} | Ticket Support`)
      .setColor("BLUE")
      .setDescription(description)
      .setThumbnail(interaction.guild.iconURL)
      .setFooter("Click the button to create a ticket.")

      const row = new MessageActionRow()
      .addComponents(
        // Create a new button
        new MessageButton()
          .setCustomId('create-id')
          .setLabel('📨 Create Ticket')
          .setStyle('PRIMARY')
        )

        channel.send({ embeds:[ticketembed], components: [row] })
      await interaction.deferUpdate()

      
    }
                   }
         })
      // ticket
      client.on("interactionCreate", async (interaction) => {
        if (interaction.isButton() && interaction.isModalSubmit()) {
    if (interaction.customId === 'create-id') {
      const support_id = interaction.fields.getTextInputValue('role-id');
      const category_id = interaction.fields.getTextInputValue('category-id');
        const existingTicket = db.get(`tickets_${message.author.id}`);
    if (existingTicket) {
      message.reply('You already have an open ticket.');
      return;
    }
       const ticketNumber = db.add('ticketCount', 1);
    const ticketChannelName = `ticket-${ticketNumber}`;

      // ticket create function
      interaction.guild.channels.create(ticketChannelName, { type: 'text' })
  .then((channel) => {
    channel.setParent(category_id); // Replace with the ID of the category where you want to create the tickets

    const supportRole = interaction.guild.roles.cache.get(support_id); // Replace with the ID of the support role

    channel.permissionOverwrites.set([
      {
        id: interaction.guild.roles.everyone,
        deny: ['VIEW_CHANNEL'],
      },
      {
        id: interaction.member.id,
        allow: ['VIEW_CHANNEL'],
      },
      {
        id: supportRole.id,
        allow: ['VIEW_CHANNEL'],
      },
    ]);
const row = new MessageActionRow()
      .addComponents(
        // Create a new button
        new MessageButton()
         .setCustomId('closeTicket')
      .setLabel('Close Ticket')
      .setStyle('DANGER')
        )
   

    channel.send(`Ticket created! Use the close button when you're done.`);

    channel.send({ content: `<@${interaction.member.id}>`, components: [row] });

    db.set(`tickets_${interaction.member.id}`, channel.id);
  })
  .catch((error) => {
    console.error('Error creating ticket:', error);
  });


      
    }
        }
      })
      // submission
      client.on("interactionCreate", async (interaction) => { 
                   if (interaction.isModalSubmit()) {
    if (interaction.customId === 'modal') {
      const channel_id = interaction.fields.getTextInputValue('channel-id');
      const item_name = interaction.fields.getTextInputValue('item-name');
      const item_price = interaction.fields.getTextInputValue('item-price');
      const item_detail = interaction.fields.getTextInputValue('item-detail');
      const item_embed = interaction.fields.getTextInputValue('item-embed');

      let words = ["yes"]
      let words2 = ["no"]
      let message;

      //if(item_embed != words || item_embed != words2) return interaction.reply({ content: "Oops! I can't tell what your typing, is it a yes or no?"})

      

      let list = new MessageEmbed()
      .setAuthor(`${item_name}`)
      .setColor("RANDOM")
      .addField(`Item Price:`, `\`\`\`${item_price}\`\`\``)
      .setDescription(`Item description: \`\`\`${item_detail}\`\`\``)

      const row = new MessageActionRow()
      .addComponents(
        // Create a new button
        new MessageButton()
          .setCustomId('purchase-id')
          .setLabel('Order')
          .setStyle('PRIMARY')
      );

      //if(!item_embed.toLowerCase() || !item_embed.toUpperCase()) return interaction.reply({ content: "Oops! not vaild."})

      // Replace 'CHANNEL_ID' with the actual channel ID where you want to send the message
    const channelId = channel_id;

    // Find the channel using the channel ID
    const channel = await client.channels.fetch(channelId);

       if(item_embed.includes(words2)){
        channel.send({ content: `${item_name}\n\nItem price: \`\`\`${item_price}\`\`\`\n\nItem Description: \`\`\`${item_detail}\`\`\``, components: [row] })
         return await interaction.deferUpdate()
       }

        if (channel?.isText()) {
      // Send a message to the channel
      channel.send({ embeds: [list], components: [row] });
    return await interaction.deferUpdate()
    } else {
      console.log(`Channel with ID <#${channelId}> is not a valid TextChannel.`);
    }

    }
       }
      })
        client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'purchase-id') {
      const guild = interaction.guild;
    const owner = await guild.fetchOwner();
      interaction.member.send({ content: "You have successfully order this item! Please wait till the owner DMs you." })

      owner.send(`<@${interaction.member.id}> has made a order, Dm him to sell it to him.`)
      await interaction.reply({
        content: 'Interaction has been send to your DMs.',
        ephemeral: true, // Make the response visible only to the user who clicked the button
        })

    }
  }
      });
      
    }
}