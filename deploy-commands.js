require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('pontaj').setDescription('Deschide meniul de pontaj cu butoanele Clock In / Clock Out / View Your Time'),
]
.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('⏳ Înregistrăm comenzile...');

    await rest.put(
      Routes.applicationGuildCommands('1390100242417979563', '1390096592450879651'),
      { body: commands },
    );

    console.log('✅ Comenzile au fost înregistrate cu succes.');
  } catch (error) {
    console.error(error);
  }
})();
