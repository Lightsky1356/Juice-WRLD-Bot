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

const ALBUM_DATA = {
  gagr: {
    name: "Goodbye & Good Riddance",
    year: 2018,
    type: "Studio Album",
    color: 0xff4500,
    image: "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
    tracks: [
      "Intro", "All Girls Are the Same", "Lucid Dreams", "Verified",
      "Lean Wit Me", "I'm Still", "Benny Blanco", "Wasted",
      "Black & White", "Beat It", "Armed and Dangerous", "Cigarettes",
      "Hurt Me", "Long Gone", "Paranoia", "Scared of Love",
      "Used To", "Karma", "734", "Moonshine"
    ],
    singles: ["All Girls Are the Same", "Lucid Dreams", "Lean Wit Me", "Wasted", "Armed and Dangerous"],
    producers: "Nick Mira, Cubeatz, Boi-1da, Frank Dukes",
    label: "Grade A, Interscope",
    certification: "3x Platinum",
    peak: "#4 Billboard 200",
    description: "Juice's debut studio album. A raw, emotional project that cemented him as a star. 'Lucid Dreams' sampled Sting and became one of the biggest songs of 2018.",
  },
  wod: {
    name: "Wrld on Drugs",
    year: 2018,
    type: "Collaborative Mixtape",
    color: 0x1e90ff,
    image: "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
    tracks: [
      "Jet Lag", "Astronauts", "Fine China", "Trade Off",
      "Here We Go Again", "Shorty", "Realer N Realer", "No Issues",
      "WRLD On Drugs", "Shooters", "Real Love", "Hide",
      "XO Tour Llif3", "All Out", "Feelin' Pearly"
    ],
    singles: ["Fine China", "Realer N Realer"],
    producers: "Nick Mira, Wheezy, Tay Keith, Dre Moon",
    label: "Grade A, Epic",
    certification: "Platinum",
    peak: "#2 Billboard 200",
    description: "Juice and Future's collaborative mixtape. Blends Juice's melodic emo style with Future's trap sound.",
  },
  drfl: {
    name: "Death Race for Love",
    year: 2019,
    type: "Studio Album",
    color: 0xdc143c,
    image: "https://i.scdn.co/image/ab67618600001016580580ecfee3454ddf01c6d2",
    tracks: [
      "Empty", "Maze", "Heere Me Calling", "Robbery", "Flava",
      "Athan", "Heal Me", "Fast", "Big", "Bogus",
      "Ring Ring", "Desire", "Ransom", "20 Min", "Legacy",
      "Ukukelele", "ON GOD", "Wishing Well", "Screw Juice",
      "All Night", "Make Believe", "Won't Let Go", "I Want It"
    ],
    singles: ["Robbery", "Hear Me Calling", "Fast"],
    producers: "Nick Mira, Mitch Mula, Boi-1da, Andrew Watt",
    label: "Grade A, Interscope",
    certification: "Platinum",
    peak: "#1 Billboard 200",
    description: "Juice's second studio album and first #1 debut. More mature and ambitious than GAGR. Features the hit 'Robbery' and the TikTok viral '20 Min'.",
  },
  lnd: {
    name: "Legends Never Die",
    year: 2020,
    type: "Posthumous Album",
    color: 0x9400d3,
    image: "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
    tracks: [
      "Anxiety (Intro)", "Conversations", "Titanic", "Bad Energy",
      "Righteous", "Blood on My Jeans", "Smile", "Tell Me U Luv Me",
      "Hate the Other Side", "Get Through It", "Life's a Mess",
      "Come & Go", "I Want It", "Fighting Demons", "Wishing Well",
      "Sorrow", "By Your Side", "Stay High", "Can't Decide",
      "Heartbound", "Juicy Wrld"
    ],
    singles: ["Righteous", "Tell Me U Luv Me", "Come & Go", "Life's a Mess", "Wishing Well"],
    producers: "Nick Mira, Marshmello, Benny Blanco, Andrew Watt",
    label: "Grade A, Interscope",
    certification: "2x Platinum",
    peak: "#1 Billboard 200",
    description: "First posthumous album. 21 tracks representing Juice's best unreleased music. 5 songs hit the top 10 simultaneously — only The Beatles and Drake had done this.",
  },
  fd: {
    name: "Fighting Demons",
    year: 2021,
    type: "Posthumous Album",
    color: 0x2e8b57,
    image: "https://i.scdn.co/image/ab67618600001016580580ecfee3454ddf01c6d2",
    tracks: [
      "Sorrow", "Born to Die", "Already Dead", "Never End",
      "Fighting Demons", "Wandered to LA", "Guitar in My Room",
      "Doomsday", "Girl of My Dreams", "Relocate", "Go Hard",
      "Cigarettes", "Sometimes", "Diet Lug", "You Got the Key",
      "From My Window"
    ],
    singles: ["Already Dead", "Wandered to LA", "Girl of My Dreams"],
    producers: "Nick Mira, Hit-Boy, Larry June",
    label: "Grade A, Interscope",
    certification: "Platinum",
    peak: "#5 Billboard 200",
    description: "Second posthumous album. Includes 'Cigarettes' which became a viral hit. Features Suga from BTS and Justin Bieber.",
  },
  tpne: {
    name: "The Party Never Ends",
    year: 2024,
    type: "Posthumous Album",
    color: 0xff8c00,
    image: "https://i.scdn.co/image/ab67618600001016580580ecfee3454ddf01c6d2",
    tracks: [
      "The Party Never Ends", "AGATS2 (Insecure)", "Lucid Dreams (Revisited)",
      "Adore You", "Empty Wrist", "Goodbye & Good Riddance 2.0",
      "Cavalier", "Celebrate", "Sativa", "Oxy Cotton",
      "Feline", "World Tour", "Crash", "All the Way",
      "Backyard Boy", "Last Call", "The End"
    ],
    singles: ["AGATS2 (Insecure)", "Lucid Dreams (Revisited)"],
    producers: "Nick Mira, Metro Boomin, Wheezy",
    label: "Grade A, Interscope",
    certification: "N/A",
    peak: "N/A",
    description: "Juice's fifth and final studio album. Announced in 2023, released November 2024. Features Nicki Minaj and a virtual Fortnite concert.",
  },
  outsiders: {
    name: "The Outsiders",
    year: 2026,
    type: "Posthumous Album",
    color: 0x00ced1,
    image: "https://i.scdn.co/image/ab6761610000f17823a60030944f7853c21565ef",
    tracks: ["TBA"],
    singles: ["TBA"],
    producers: "TBA",
    label: "Grade A, Interscope",
    certification: "N/A",
    peak: "N/A",
    description: "Juice's sixth studio album. Announced July 2026 via Instagram. Details are still unknown. The party continues.",
  },
};

const TRIVIA_QUESTIONS = [
  { q: "What was Juice WRLD's real name?", options: ["Jarad Anthony Higgins", "Jarad Williams", "Jarad Smith", "Jarad Brown"], answer: 0 },
  { q: "When was Juice WRLD born?", options: ["December 2, 1998", "March 15, 1999", "July 4, 1997", "October 31, 2000"], answer: 0 },
  { q: "What city was Juice WRLD born in?", options: ["Chicago, Illinois", "Los Angeles, California", "Atlanta, Georgia", "New York City, New York"], answer: 0 },
  { q: "What was the name of Juice's debut album?", options: ["Goodbye & Good Riddance", "Death Race for Love", "Legends Never Die", "9 9 9"], answer: 0 },
  { q: "Which song from GAGR went Diamond?", options: ["Lucid Dreams", "All Girls Are the Same", "Lean Wit Me", "Wasted"], answer: 0 },
  { q: "What was the original name Juice WRLD used on SoundCloud?", options: ["JuicetheKidd", "JuiceBoy", "JuiceMan", "JuiceKing"], answer: 0 },
  { q: "What 1992 film inspired Juice's stage name?", options: ["Juice", "Boyz n the Hood", "Menace II Society", "Friday"], answer: 0 },
  { q: "Which artist did Juice collaborate with on 'Fine China'?", options: ["Future", "Lil Uzi Vert", "Travis Scott", "Lil Baby"], answer: 0 },
  { q: "What instrument did Juice learn at age 4?", options: ["Piano", "Guitar", "Drums", "Violin"], answer: 0 },
  { q: "How many songs hit the top 10 simultaneously with LND?", options: ["5", "3", "7", "2"], answer: 0 },
  { q: "Which artist featured on 'Come & Go'?", options: ["Marshmello", "Skrillex", "Diplo", "Calvin Harris"], answer: 0 },
  { q: "What was Juice's last released song before his death?", options: ["Bandit", "Robbery", "Fast", "Hear Me Calling"], answer: 0 },
  { q: "What record label signed Juice WRLD?", options: ["Grade A Productions", "Quality Control", "Young Money", "Def Jam"], answer: 0 },
  { q: "Who is Juice WRLD's second cousin?", options: ["Young Dolph", "Future", "Lil Bibby", "Lil Peep"], answer: 0 },
  { q: "What high school did Juice attend?", options: ["Homewood-Flossmoor", "South Side", "Lincoln Park", "De La Salle"], answer: 0 },
  { q: "What was the name of Juice's collaborative mixtape with Future?", options: ["Wrld on Drugs", "Wrld on Fire", "Wrld on Top", "Wrld on Me"], answer: 0 },
  { q: "Which BTS members featured on Juice's songs?", options: ["RM and Suga", "Jin and Jungkook", "V and Jimin", "J-Hope and Suga"], answer: 0 },
  { q: "What year did Juice WRLD sign with Interscope?", options: ["2018", "2017", "2019", "2016"], answer: 0 },
  { q: "What streaming platform did Juice reach 1 billion streams on?", options: ["Spotify", "Apple Music", "YouTube Music", "Tidal"], answer: 0 },
  { q: "What was Juice WRLD's zodiac sign?", options: ["Sagittarius", "Scorpio", "Capricorn", "Aquarius"], answer: 0 },
  { q: "What was the name of the Fortnite concert event?", options: ["Into the Abyss", "Juice WRLD World", "999 Concert", "Legends Never Die Live"], answer: 0 },
  { q: "Which artist did Juice mentor?", options: ["The Kid Laroi", "Lil Tjay", "Polo G", "Iann Dior"], answer: 0 },
  { q: "What was the name of Juice's 2020 documentary?", options: ["Into the Abyss", "Legends Never Die", "999 Forever", "Juice WRLD Story"], answer: 0 },
  { q: "What did Juice sample in 'Lucid Dreams'?", options: ["Shape of My Heart by Sting", "Stan by Eminem", "Space Oddity by David Bowie", "Bohemian Rhapsody by Queen"], answer: 0 },
  { q: "What album did 'Bandit' appear on?", options: ["Death Race for Love", "Goodbye & Good Riddance", "Legends Never Die", "Wrld on Drugs"], answer: 0 },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const GUESS_SONGS = [
  { song: "Lucid Dreams", lyric: "I still see your shadows in the room", hint: "2018, sampled Sting" },
  { song: "All Girls Are the Same", lyric: "All girls are the same, they're rotting my brain", hint: "2018, GAGR" },
  { song: "Lean Wit Me", lyric: "Lean with me, pop with me", hint: "2018, GAGR" },
  { song: "Robbery", lyric: "She told me to put my heart in the bag and nobody gets hurt", hint: "2019, DRFL" },
  { song: "Fast", lyric: "I move so fast, they can't catch me", hint: "2019, DRFL" },
  { song: "Wishing Well", lyric: "Toss my pain with my wishes in a wishing well", hint: "2020, LND" },
  { song: "Come & Go", lyric: "We could've had it all", hint: "2020, with Marshmello" },
  { song: "Righteous", lyric: "Righteous, righteous", hint: "2020, first posthumous single" },
  { song: "Already Dead", lyric: "I'm already dead, I'm already dead", hint: "2021, FD" },
  { song: "Bandit", lyric: "I'm a bandit, got bands in the safe", hint: "2019, with NBA YoungBoy" },
  { song: "Hear Me Calling", lyric: "I've been up for three days, I'm going crazy", hint: "2019, DRFL" },
  { song: "Cigarettes", lyric: "She's smoking cigarettes, watching Captain Hook", hint: "2022, FD deluxe" },
  { song: "Empty", lyric: "Empty, I feel so empty", hint: "2019, DRFL" },
  { song: "Maze", lyric: "Running through the maze, I can't find my way", hint: "2019, DRFL" },
  { song: "Conversations", lyric: "Conversations in my head, they never end", hint: "2020, LND" },
  { song: "Life's a Mess", lyric: "Life's a mess, I'm a mess", hint: "2020, with Halsey" },
  { song: "Wandered to LA", lyric: "I wandered to LA, looking for a change", hint: "2021, with Justin Bieber" },
  { song: "Smile", lyric: "You make me smile when I'm feeling down", hint: "2020, with The Weeknd" },
  { song: "Girl of My Dreams", lyric: "She's the girl of my dreams", hint: "2021, with Suga of BTS" },
  { song: "AGATS2", lyric: "All girls are the same, round 2", hint: "2024, with Nicki Minaj" },
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

  async album({ interaction }) {
    const input = interaction.options.getString("name")?.toLowerCase();
    if (!input) {
      const embed = new EmbedBuilder()
        .setColor(0x8b0000)
        .setTitle("Juice WRLD Discography")
        .setDescription("All albums. Use `/album <name>` for details.")
        .addFields(
          Object.entries(ALBUM_DATA).map(([key, a]) => ({
            name: a.name,
            value: `${a.year} | ${a.type} | ${a.peak}`,
            inline: true,
          }))
        )
        .setFooter({ text: "Juice WRLD Albums" })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const album = ALBUM_DATA[input]
      || Object.values(ALBUM_DATA).find((a) => a.name.toLowerCase().includes(input));

    if (!album) {
      return interaction.reply({ content: "Album not found. Try: gagr, wod, drfl, lnd, fd, tpne, outsiders", ephemeral: true });
    }

    const trackList = album.tracks.map((t, i) => `${i + 1}. ${t}`).join("\n");
    const embed = new EmbedBuilder()
      .setColor(album.color)
      .setTitle(album.name)
      .setDescription(album.description)
      .addFields(
        { name: "Year", value: String(album.year), inline: true },
        { name: "Type", value: album.type, inline: true },
        { name: "Peak", value: album.peak, inline: true },
        { name: "Certification", value: album.certification, inline: true },
        { name: "Label", value: album.label, inline: true },
        { name: "Producers", value: album.producers },
        { name: "Singles", value: album.singles.join(", ") },
        { name: `Tracklist (${album.tracks.length} songs)`, value: trackList }
      )
      .setThumbnail(album.image)
      .setFooter({ text: "Juice WRLD Albums" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async trivia({ interaction }) {
    const q = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
    const shuffledOptions = shuffleArray(q.options);
    const correctAnswer = shuffledOptions.indexOf(q.options[q.answer]);

    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle("Juice WRLD Trivia")
      .setDescription(q.q)
      .addFields(
        shuffledOptions.map((opt, i) => ({
          name: `${i + 1}.`,
          value: opt,
          inline: true,
        }))
      )
      .setFooter({ text: "Reply with the number of your answer!" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const filter = (m) => m.author.id === interaction.user.id;
    try {
      const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] });
      const response = collected.first().content;
      const answerNum = parseInt(response);

      if (answerNum === correctAnswer + 1) {
        await interaction.followUp({ content: `Correct! The answer is: **${q.options[q.answer]}**` });
      } else {
        await interaction.followUp({ content: `Wrong! The answer is: **${q.options[q.answer]}**` });
      }
    } catch {
      await interaction.followUp({ content: `Time's up! The answer is: **${q.options[q.answer]}**` });
    }
  },

  async quiz({ interaction }) {
    const questions = shuffleArray(TRIVIA_QUESTIONS).slice(0, 5);
    let score = 0;

    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle("Juice WRLD Quiz")
      .setDescription(`5 questions about Juice WRLD. Let's go!`)
      .setFooter({ text: "Answer each question with a number (1-4)" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const shuffledOptions = shuffleArray(q.options);
      const correctAnswer = shuffledOptions.indexOf(q.options[q.answer]);

      const questionEmbed = new EmbedBuilder()
        .setColor(0x8b0000)
        .setTitle(`Question ${i + 1}/5`)
        .setDescription(q.q)
        .addFields(
          shuffledOptions.map((opt, idx) => ({
            name: `${idx + 1}.`,
            value: opt,
            inline: true,
          }))
        )
        .setTimestamp();

      await interaction.followUp({ embeds: [questionEmbed] });

      const filter = (m) => m.author.id === interaction.user.id;
      try {
        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] });
        const response = collected.first().content;
        const answerNum = parseInt(response);

        if (answerNum === correctAnswer + 1) {
          score++;
          await interaction.followUp({ content: `Correct! (${score}/${i + 1})` });
        } else {
          await interaction.followUp({ content: `Wrong! The answer is: **${q.options[q.answer]}** (${score}/${i + 1})` });
        }
      } catch {
        await interaction.followUp({ content: `Time's up! The answer is: **${q.options[q.answer]}** (${score}/${i + 1})` });
      }
    }

    const resultEmbed = new EmbedBuilder()
      .setColor(score >= 4 ? 0x00ff00 : score >= 2 ? 0xffa500 : 0xff0000)
      .setTitle("Quiz Complete!")
      .setDescription(`You scored **${score}/5**!`)
      .addFields({
        name: "Rating",
        value: score === 5 ? "True Juice WRLD Fan!" : score >= 3 ? "Big Fan" : "Casual Listener",
      })
      .setTimestamp();

    return interaction.followUp({ embeds: [resultEmbed] });
  },

  async guess({ interaction }) {
    const song = GUESS_SONGS[Math.floor(Math.random() * GUESS_SONGS.length)];
    const shuffledOptions = shuffleArray(GUESS_SONGS.map((s) => s.song)).slice(0, 4);
    if (!shuffledOptions.includes(song.song)) {
      shuffledOptions[Math.floor(Math.random() * 4)] = song.song;
    }

    const embed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle("Guess the Song")
      .setDescription(`*"${song.lyric}"*`)
      .addFields(
        shuffledOptions.map((opt, i) => ({
          name: `${i + 1}.`,
          value: opt,
          inline: true,
        }))
      )
      .setFooter({ text: "Reply with the number of your guess!" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const filter = (m) => m.author.id === interaction.user.id;
    try {
      const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] });
      const response = collected.first().content;
      const answerNum = parseInt(response);
      const guessedSong = shuffledOptions[answerNum - 1];

      if (guessedSong === song.song) {
        await interaction.followUp({ content: `Correct! The song is: **${song.song}** ${song.hint}` });
      } else {
        await interaction.followUp({ content: `Wrong! The song is: **${song.song}** ${song.hint}` });
      }
    } catch {
      await interaction.followUp({ content: `Time's up! The song is: **${song.song}** ${song.hint}` });
    }
  },
};

module.exports = commands;
