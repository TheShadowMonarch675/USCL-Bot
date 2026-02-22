index.jsconst { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// VARIÁVEIS (Railway)
const TOKEN = process.env.TOKEN;
const CANAL_TRANSFERENCIAS = process.env.CANAL;
const CARGO_MANAGER = "Manager";

client.once("ready", async () => {
  console.log(`Bot online: ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName("offer")
      .setDescription("Fazer oferta por um jogador")
      .addStringOption(o =>
        o.setName("jogador").setDescription("Nome do jogador").setRequired(true))
      .addStringOption(o =>
        o.setName("time").setDescription("Time interessado").setRequired(true)),

    new SlashCommandBuilder()
      .setName("release")
      .setDescription("Liberar jogador")
      .addStringOption(o =>
        o.setName("jogador").setDescription("Nome do jogador").setRequired(true))
  ];

  await client.application.commands.set(commands);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (!interaction.member.roles.cache.some(r => r.name.includes(CARGO_MANAGER))) {
    return interaction.reply({ content: "❌ Apenas managers.", ephemeral: true });
  }

  const canal = interaction.guild.channels.cache.get(CANAL_TRANSFERENCIAS);
  if (!canal) return;

  if (interaction.commandName === "offer") {
    const jogador = interaction.options.getString("jogador");
    const time = interaction.options.getString("time");

    const embed = new EmbedBuilder()
      .setTitle("📢 NOVA OFERTA")
      .addFields(
        { name: "Jogador", value: jogador },
        { name: "Time", value: time },
        { name: "Status", value: "⏳
