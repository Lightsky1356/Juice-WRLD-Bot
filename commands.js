const path = require("path");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { randomQuote } = require("./quotes");
const { randomPic } = require("./juicepics");
const { randomGif } = require("./juicegifs");

const ERAS = {
  "1.0": {
    name: "Era 1.0 (2015-2017)",
    color: 0x00ff00,
    description: "The beginning. Under the name JuicetheKidd, Juice started uploading tracks to SoundCloud recorded on his phone. Signed with Grade A Productions in 2017.",
    songs: ["Forever", "Too Much Cash", "Lucid Dreams (Original)", "All Girls Are the Same"],
    image: "https://i.scdn.co/image/ab6761610000e5eb23a60030944f7853c21565ef",
  },
  "2.0": {
    name: "Era 2.0 (2018)",
    color: 0xff0000,
    description: "Goodbye & Good Riddance era. Lucid Dreams went diamond, the debut album dropped, and Juice became a superstar. WRLD Domination tour.",
    songs: ["Lucid Dreams", "All Girls Are the Same", "Lean Wit Me", "Wasted", "Armed and Dangerous"],
    image: "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
  },
  "3.0": {
    name: "Era 3.0 (2019)",
    color: 0x00bfff,
    description: "Death Race for Love. #1 debut on Billboard 200. Nicki Wrld Tour. Collabs with Future, BTS, Ellie Goulding, and YoungBoy. Bandit was his last release.",
    songs: ["Robbery", "Hear Me Calling", "Fast", "Bandit", "Hate Me", "Graduation"],
    image: "https://i.scdn.co/image/ab67618600001016580580ecfee3454ddf01c6d2",
  },
  "4.0": {
    name: "Era 4.0 - Posthumous (2020-2022)",
    color: 0x9932cc,
    description: "Legends Never Die & Fighting Demons. 5 songs in the top 10 simultaneously (Beatles & Drake territory). Documentary Into the Abyss.",
    songs: ["Righteous", "Come & Go", "Wishing Well", "Life's a Mess", "Already Dead", "Cigarettes", "Girl of My Dreams"],
    image: "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
  },
  "5.0": {
    name: "Era 5.0 - The Party Never Ends (2023-2024)",
    color: 0xffa500,
    description: "The final album era. Fortnite concert. The Party Never Ends released November 2024. Legacy continues.",
    songs: ["AGATS2 (Insecure)", "Lucid Dreams (Revisited)", "The Party Never Ends"],
    image: "https://i.scdn.co/image/ab67618600001016580580ecfee3454ddf01c6d2",
  },
};

const ALBUMS = [
  { name: "Goodbye & Good Riddance", year: 2018, type: "Studio", color: 0xff4500 },
  { name: "Wrld on Drugs (with Future)", year: 2018, type: "Collaborative", color: 0x1e90ff },
  { name: "Death Race for Love", year: 2019, type: "Studio", color: 0xdc143c },
  { name: "Legends Never Die", year: 2020, type: "Posthumous", color: 0x9400d3 },
  { name: "Fighting Demons", year: 2021, type: "Posthumous", color: 0x2e8b57 },
  { name: "The Party Never Ends", year: 2024, type: "Posthumous", color: 0xff8c00 },
  { name: "The Outsiders", year: 2026, type: "Posthumous", color: 0x00ced1 },
];

const ART_URLS = [
  "https://i.pinimg.com/736x/3a/4e/8a/3a4e8a3b4c5d6e7f8a9b0c1d2e3f4a5b.jpg",
  "https://i.pinimg.com/736x/4b/5f/9c/4b5f9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg",
  "https://i.pinimg.com/736x/5c/6a/0d/5c6a0d1e2f3a4b5c6d7e8f9a0b1c2d3e.jpg",
];

const MEME_URLS = [
  "https://i.imgflip.com/4/30b1gx.jpg",
  "https://i.imgflip.com/4/1h7kjf.jpg",
  "https://i.imgflip.com/4/1bij.jpg",
];

const DAILY_CONTENT = [
  { type: "quote", content: "Legends never die — they live on in the music." },
  { type: "fact", content: "Juice WRLD learned to play piano at age 4." },
  { type: "fact", content: "His real name is Jarad Anthony Higgins." },
  { type: "fact", content: "He signed with Grade A Productions in 2017." },
  { type: "fact", content: "Lucid Dreams has over 1 billion streams on Spotify." },
  { type: "fact", content: "He was a fan of rock bands like Blink-182 and Black Sabbath." },
  { type: "fact", content: "He freestyled most of his songs." },
  { type: "fact", content: "His debut album Goodbye & Good Riddance went triple platinum." },
  { type: "fact", content: "He appeared on Eminem's 'Godzilla' posthumously." },
  { type: "fact", content: "He performed at Rolling Loud multiple times." },
  { type: "fact", content: "His stage name comes from the 1992 film Juice." },
  { type: "fact", content: "He graduated from Homewood-Flossmoor High School in 2017." },
  { type: "fact", content: "He was the third artist to have 5 songs in the Hot 100 top 10 simultaneously (after The Beatles and Drake)." },
  { type: "quote", content: "I still see your shadows in my room." },
  { type: "quote", content: "Music is my therapy — I put everything I feel into a song." },
  { type: "quote", content: "All legends fall in the making." },
  { type: "quote", content: "Everybody stay positive no matter how negative life gets." },
  { type: "quote", content: "I freestyle a lot of my songs; that's how I catch the vibe." },
  { type: "fact", content: "He released 3 studio albums during his lifetime." },
  { type: "fact", content: "He was born on December 2, 1998, in Chicago, Illinois." },
];

function getDaily() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return DAILY_CONTENT[dayOfYear % DAILY_CONTENT.length];
}

const SESSIONS = [
  { song: "Lucid Dreams", producer: "Nick Mira", note: "Freestyled in one take. Sampled Sting's 'Shape of My Heart'. Released on 9 9 9 EP (2017).", length: "3:04" },
  { song: "All Girls Are the Same", producer: "Cuban Cloud, Nick Mira", note: "Written in a session with Cole Bennett. Released as a single before Goodbye & Good Riddance.", length: "3:00" },
  { song: "Lean Wit Me", producer: "Nick Mira", note: "Juice freestyled the hook. One of his most personal tracks about substance use.", length: "2:55" },
  { song: "Robbery", producer: "Nick Mira, Mitch Mula", note: "Written about a real relationship. The music video was directed by Cole Bennett.", length: "4:03" },
  { song: "Fast", producer: "Tre Maison", note: "From Death Race for Love. About the fast lifestyle of fame.", length: "3:23" },
  { song: "Wishing Well", producer: "Nick Mira", note: "One of his most emotional posthumous tracks from Legends Never Die.", length: "3:15" },
  { song: "Come & Go", producer: "Marshmello", note: "Collaboration with Marshmello. Peaked at #2 on Billboard Hot 100.", length: "3:26" },
  { song: "Bandit", producer: "Nick Mira, Tay Keith", note: "Last song released before his death. Features YoungBoy Never Broke Again.", length: "3:00" },
  { song: "Righteous", producer: "Nick Mira", note: "First posthumous single. Recorded at his home studio in Los Angeles.", length: "3:15" },
  { song: "Cigarettes", producer: "Nick Mira", note: "From Fighting Demons deluxe. Debuted at #43 on Hot 100.", length: "2:58" },
  { song: "Armed and Dangerous", producer: "Nick Mira", note: "Released as a single in October 2018. Later added to Goodbye & Good Riddance reissue.", length: "2:45" },
  { song: "Hear Me Calling", producer: "Nick Mira", note: "Single from Death Race for Love. Music video directed by Cole Bennett.", length: "3:09" },
];

const commands = {
  async quote({ interaction }) {
    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setDescription(`*${randomQuote()}*`)
      .setFooter({ text: "Juice WRLD" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async juicepic({ interaction }) {
    const pic = randomPic();
    const embed = new EmbedBuilder()
      .setColor(0x8b1538)
      .setTitle("Juice WRLD")
      .setFooter({ text: "Legends Never Die \u2022 999" })
      .setTimestamp();

    if (typeof pic === "string" && pic.startsWith("http")) {
      embed.setImage(pic);
    } else {
      const filename = path.basename(pic);
      embed.setImage(`attachment://${filename}`);
    }

    const files = typeof pic !== "string" || !pic.startsWith("http")
      ? [new AttachmentBuilder(pic)]
      : undefined;

    return interaction.reply({ embeds: [embed], files });
  },

  async juicegif({ interaction }) {
    const gif = randomGif();
    const embed = new EmbedBuilder()
      .setColor(0x8b1538)
      .setTitle("Juice WRLD")
      .setFooter({ text: "Legends Never Die \u2022 999" })
      .setTimestamp();

    if (typeof gif === "string" && gif.startsWith("http")) {
      embed.setImage(gif);
    } else {
      const filename = path.basename(gif);
      embed.setImage(`attachment://${filename}`);
    }

    const files = typeof gif !== "string" || !gif.startsWith("http")
      ? [new AttachmentBuilder(gif)]
      : undefined;

    return interaction.reply({ embeds: [embed], files });
  },

  async era({ interaction }) {
    const eraInput = interaction.options.getString("name")?.toLowerCase();
    if (!eraInput) {
      const embed = new EmbedBuilder()
        .setColor(0x8b0000)
        .setTitle("Juice WRLD Eras")
        .setDescription(
          Object.entries(ERAS)
            .map(([key, e]) => `**${key}** - ${e.name}`)
            .join("\n")
        )
        .setFooter({ text: "Use /era <name> to get details" })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const era = ERAS[eraInput] || ERAS[eraInput.replace("era ", "")];
    if (!era) {
      return interaction.reply({ content: "Era not found. Available eras: 1.0, 2.0, 3.0, 4.0, 5.0", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(era.color)
      .setTitle(era.name)
      .setDescription(era.description)
      .addFields({ name: "Notable Songs", value: era.songs.map((s) => `\u2022 ${s}`).join("\n") })
      .setThumbnail(era.image)
      .setFooter({ text: "Juice WRLD Eras" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async juiceart({ interaction }) {
    const embed = new EmbedBuilder()
      .setColor(0x8b1538)
      .setTitle("Juice WRLD Art")
      .setDescription("Random Juice WRLD fan art / artwork")
      .setImage("https://i.pinimg.com/originals/3a/4e/8a/3a4e8a3b4c5d6e7f8a9b0c1d2e3f4a5b.jpg")
      .setFooter({ text: "Legends Never Die \u2022 999" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async meme({ interaction }) {
    const embed = new EmbedBuilder()
      .setColor(0x8b1538)
      .setTitle("Juice WRLD Meme")
      .setDescription("Random Juice WRLD meme")
      .setImage("https://i.imgflip.com/4/30b1gx.jpg")
      .setFooter({ text: "Legends Never Die \u2022 999" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async daily({ interaction }) {
    const item = getDaily();
    const typeEmoji = item.type === "quote" ? "\uD83D\uDCDD" : "\uD83D\uDCA1";
    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle(`${typeEmoji} Daily Juice WRLD`)
      .setDescription(item.type === "quote" ? `*"${item.content}"*` : item.content)
      .setFooter({ text: "Juice WRLD \u2022 Come back tomorrow!" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async help({ interaction }) {
    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle("Juice WRLD Bot - Commands")
      .setDescription("All available slash commands")
      .addFields(
        { name: "\uD83D\uDCDD Content", value: "`/quote` - Random Juice WRLD quote\n`/juicepic` - Random Juice WRLD picture\n`/juicegif` - Random Juice WRLD GIF\n`/juiceart` - Random Juice WRLD art\n`/meme` - Random Juice WRLD meme\n`/daily` - Daily Juice WRLD content" },
        { name: "\uD83C\uDFB6 Music", value: "`/era <name>` - Juice WRLD eras (1.0-5.0)\n`/session <song>` - Recording session info" },
        { name: "\uD83D\uDC64 Info", value: "`/bio` - Jarad Anthony Higgins info\n`/info` - Bot info\n`/settings` - Server settings" },
      )
      .setFooter({ text: "Legends Never Die \u2022 999" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async info({ interaction }) {
    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle("Juice WRLD Bot")
      .setDescription("A Discord bot dedicated to the legendary Juice WRLD")
      .addFields(
        { name: "Bot Name", value: "Juice WRLD Bot", inline: true },
        { name: "Version", value: "1.0.0", inline: true },
        { name: "Library", value: "discord.js", inline: true },
        { name: "Commands", value: "12", inline: true },
        { name: "Quotes", value: "131", inline: true },
        { name: "GIFs", value: "40", inline: true },
        { name: "Developer", value: "Lightsky1356", inline: true },
        { name: "Purpose", value: "Keep Juice WRLD's legacy alive in Discord servers worldwide" },
      )
      .setThumbnail("https://i.scdn.co/image/ab6761610000e5eb23a60030944f7853c21565ef")
      .setFooter({ text: "Legends Never Die \u2022 999" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async settings({ interaction }) {
    if (!interaction.member.permissions.has("MANAGE_GUILD")) {
      return interaction.reply({ content: "You need **Manage Server** permission to use this command.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle("Server Settings")
      .setDescription("Current bot settings for this server")
      .addFields(
        { name: "Server", value: interaction.guild.name, inline: true },
        { name: "Server ID", value: interaction.guild.id, inline: true },
        { name: "Bot Joined", value: "N/A", inline: true },
        { name: "Default Channel", value: "All channels", inline: true },
        { name: "Embed Color", value: "#8b0000", inline: true },
        { name: "Prefix", value: "N/A (slash commands only)", inline: true },
      )
      .setFooter({ text: "Juice WRLD Bot Settings" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async session({ interaction }) {
    const songInput = interaction.options.getString("song")?.toLowerCase();
    if (!songInput) {
      const embed = new EmbedBuilder()
        .setColor(0x8b0000)
        .setTitle("Recording Sessions")
        .setDescription("Available session info. Use `/session <song>` for details.")
        .addFields(
          SESSIONS.map((s) => ({
            name: s.song,
            value: `Producer: ${s.producer} | Length: ${s.length}`,
            inline: true,
          }))
        )
        .setFooter({ text: "Juice WRLD Sessions" })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const session = SESSIONS.find((s) => s.song.toLowerCase().includes(songInput));
    if (!session) {
      return interaction.reply({ content: "Session not found. Use `/session` to see available songs.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle(`Recording Session: ${session.song}`)
      .addFields(
        { name: "Producer(s)", value: session.producer, inline: true },
        { name: "Length", value: session.length, inline: true },
        { name: "Notes", value: session.note }
      )
      .setFooter({ text: "Juice WRLD Sessions" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async bio({ interaction }) {
    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle("Jarad Anthony Higgins")
      .setDescription("**Juice WRLD** (December 2, 1998 - December 8, 2019)")
      .addFields(
        { name: "Full Name", value: "Jarad Anthony Higgins", inline: true },
        { name: "Stage Name", value: "Juice WRLD (formerly JuicetheKidd)", inline: true },
        { name: "Born", value: "December 2, 1998", inline: true },
        { name: "Died", value: "December 8, 2019 (age 21)", inline: true },
        { name: "Birthplace", value: "Chicago, Illinois", inline: true },
        { name: "Genres", value: "Emo Rap, Trap, Hip-Hop, Pop Rap, SoundCloud Rap", inline: true },
        { name: "Labels", value: "Grade A Productions, Interscope Records", inline: true },
        { name: "Years Active", value: "2015-2019", inline: true },
        { name: "Instruments", value: "Piano, Guitar, Drums, Vocals", inline: true },
        { name: "Albums (Lifetime)", value: "Goodbye & Good Riddance (2018), Death Race for Love (2019)" },
        { name: "Posthumous Albums", value: "Legends Never Die (2020), Fighting Demons (2021), The Party Never Ends (2024), The Outsiders (2026)" },
        { name: "Biggest Hit", value: "Lucid Dreams (#2 Billboard Hot 100, Diamond certified)" },
        { name: "Notable Collabs", value: "Future, Marshmello, The Weeknd, Trippie Redd, BTS, Ellie Goulding, Eminem, YoungBoy Never Broke Again" },
        { name: "Early Life", value: "Born in Chicago, grew up in Homewood, Illinois. Learned piano at age 4. Parents divorced when he was 3. Wasn't allowed to listen to hip-hop as a child; got into rock and pop through video games like Tony Hawk's Pro Skater and Guitar Hero." },
        { name: "Career", value: "Started uploading to SoundCloud in 2015 as JuicetheKidd. Signed with Grade A Productions in 2017. 'Lucid Dreams' went viral in 2018. Signed with Interscope Records for $3 million. Became one of the biggest artists in emo rap and SoundCloud rap." },
        { name: "Legacy", value: "One of the most streamed artists of all time. 5.9 billion Spotify streams in 2020 alone. 4th most streamed artist on Spotify. Influenced a generation of artists. His music continues to resonate with millions worldwide." },
        { name: "Wikipedia", value: "[Read more](https://en.wikipedia.org/wiki/Juice_Wrld)" }
      )
      .setThumbnail("https://i.scdn.co/image/ab6761610000e5eb23a60030944f7853c21565ef")
      .setFooter({ text: "Legends Never Die \u2022 999" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};

module.exports = commands;
