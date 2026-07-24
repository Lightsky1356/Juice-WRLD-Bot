require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} = require("discord.js");
const commandHandlers = require("./commands");
const { init: initPics } = require("./juicepics");
const { init: initGifs } = require("./juicegifs");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error("Missing TOKEN or CLIENT_ID in .env");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const slashCommands = [
  new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Get a random Juice WRLD quote"),
  new SlashCommandBuilder()
    .setName("juicepic")
    .setDescription("Get a random Juice WRLD picture"),
  new SlashCommandBuilder()
    .setName("juicegif")
    .setDescription("Get a random Juice WRLD GIF"),
  new SlashCommandBuilder()
    .setName("era")
    .setDescription("Learn about Juice WRLD eras")
    .addStringOption((option) =>
      option.setName("name").setDescription("Era name (1.0-5.0)").setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("juiceart")
    .setDescription("Get random Juice WRLD fan art"),
  new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get a random Juice WRLD meme"),
  new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Get daily Juice WRLD content"),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all commands"),
  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Bot info"),
  new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Server settings (admin only)"),
  new SlashCommandBuilder()
    .setName("session")
    .setDescription("Recording session info for a song")
    .addStringOption((option) =>
      option.setName("song").setDescription("Song name").setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("bio")
    .setDescription("Jarad Anthony Higgins info and bio"),
  new SlashCommandBuilder()
    .setName("album")
    .setDescription("Get album info")
    .addStringOption((option) =>
      option.setName("name").setDescription("Album name (gagr, wod, drfl, lnd, fd, tpne, outsiders)").setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Juice WRLD trivia question"),
  new SlashCommandBuilder()
    .setName("quiz")
    .setDescription("5-question Juice WRLD quiz"),
  new SlashCommandBuilder()
    .setName("guess")
    .setDescription("Guess the Juice WRLD song from a lyric"),
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerSlashCommands() {
  const body = slashCommands.map((command) => command.toJSON());
  try {
    if (GUILD_ID) {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body });
      console.log(`Registered ${body.length} guild commands`);
      return;
    }
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body });
    console.log(`Registered ${body.length} global commands`);
  } catch (error) {
    console.error("Failed to register slash commands:", error);
  }
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await initPics();
  await initGifs();
  console.log(`Cached ${require("./juicepics").cachedFiles.length} juice pics`);
  await registerSlashCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const handler = commandHandlers[interaction.commandName];
  if (!handler) return;

  try {
    await handler({
      interaction,
      member: interaction.member,
      guild: interaction.guild,
      options: interaction.options,
      client,
    });
  } catch (err) {
    console.error(`Command /${interaction.commandName} failed:`, err?.message);
    const payload = { content: "Something went wrong running that command.", ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload).catch(() => {});
    } else {
      await interaction.reply(payload).catch(() => {});
    }
  }
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason?.message || reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err?.message);
});

client.login(TOKEN);
