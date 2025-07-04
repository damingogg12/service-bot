require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

// Dicționar pentru a salva pontajele pe sesiune (nu permanent!)
const pontaje = new Map();

client.once(Events.ClientReady, () => {
  console.log(`🤖 Botul este online ca ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'pontaj') {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('clock_in')
            .setLabel('🟢 Clock In')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('clock_out')
            .setLabel('🔴 Clock Out')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('view_time')
            .setLabel('👁️ View Your Time')
            .setStyle(ButtonStyle.Secondary)
        );

      await interaction.reply({ content: '🕒 Alege o acțiune de mai jos:', components: [row], ephemeral: true });
    }
  }

  if (interaction.isButton()) {
    const userId = interaction.user.id;

    if (interaction.customId === 'clock_in') {
      pontaje.set(userId, { start: Date.now() });
      await interaction.reply({ content: '✅ Pontaj început cu succes!', ephemeral: true });
    }

    if (interaction.customId === 'clock_out') {
      const data = pontaje.get(userId);
      if (!data || !data.start) {
        await interaction.reply({ content: '⚠️ Nu ai început un pontaj!', ephemeral: true });
        return;
      }

      const durata = Date.now() - data.start;
      const ore = Math.floor(durata / (1000 * 60 * 60));
      const minute = Math.floor((durata % (1000 * 60 * 60)) / (1000 * 60));
      pontaje.delete(userId);

      await interaction.reply({ content: `🕓 Ai lucrat aproximativ ${ore}h ${minute}min.`, ephemeral: true });
    }

    if (interaction.customId === 'view_time') {
      const data = pontaje.get(userId);
      if (!data || !data.start) {
        await interaction.reply({ content: 'ℹ️ Nu ai un pontaj activ.', ephemeral: true });
        return;
      }

      const durata = Date.now() - data.start;
      const ore = Math.floor(durata / (1000 * 60 * 60));
      const minute = Math.floor((durata % (1000 * 60 * 60)) / (1000 * 60));

      await interaction.reply({ content: `⏱️ Ai început pontajul acum ${ore}h ${minute}min.`, ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
