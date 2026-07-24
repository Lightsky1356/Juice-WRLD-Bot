const path = require("path");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { randomQuote } = require("./quotes");
const { randomPic } = require("./juicepics");
const { randomGif } = require("./juicegifs");

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
};

module.exports = commands;
