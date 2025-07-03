const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const thirdStrikeCounts = new Map();

client.once('ready', () => {
  console.log(`✅ Command bot online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  //
  // MUTE
  //
  if (message.content.startsWith(".mute")) {
    if (!message.member.roles.cache.has("1389091532912463992")) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    const args = message.content.slice(5).trim().split(/ +/);
    const member = message.mentions.members.first();
    const duration = args[1];
    const reason = args.slice(2).join(" ") || "No reason provided";

    if (!member) {
      return message.reply("⚠️ Please mention a valid user to mute.");
    }

    const time = ms(duration);
    console.log(`Mute duration in ms: ${time}`);

    if (!time) {
      return message.reply("⚠️ Please provide a valid time (e.g. 10m, 1h).");
    }

    try {
      await member.timeout(time, reason);
      message.reply(`✅ ${member.user.tag} has been muted for ${duration}. Reason: ${reason}`);

      const logChannel = await client.channels.fetch("1389822705959833731");
      const embed = new EmbedBuilder()
        .setTitle("🔇 Member Muted")
        .setDescription(`${member} was muted for **${duration}**\nReason: ${reason}\nModerator: ${message.author}`)
        .setColor(0xff9900)
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("❌ I could not mute that member. Check my permissions and role hierarchy.");
    }
  }

  //
  // UNMUTE
  //
  if (message.content.startsWith(".unmute")) {
    if (!message.member.roles.cache.has("1389091532912463992")) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("⚠️ Please mention a valid user to unmute.");
    }

    try {
      await member.timeout(null);
      message.reply(`✅ ${member.user.tag} has been unmuted.`);

      const logChannel = await client.channels.fetch("1389822705959833731");
      const embed = new EmbedBuilder()
        .setTitle("🔊 Member Unmuted")
        .setDescription(`${member} was unmuted.\nModerator: ${message.author}`)
        .setColor(0x00cc66)
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("❌ I could not unmute that member. Check my permissions and role hierarchy.");
    }
  }

  //
  // WARN
  //
  if (message.content.startsWith(".warn")) {
    if (!message.member.roles.cache.has("1389091532912463992")) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    const args = message.content.slice(5).trim().split(/ +/);
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!member) {
      return message.reply("⚠️ Please mention a valid user to warn.");
    }

    const warning1Role = "1389821233562124329";
    const warning2Role = "1389821226251456552";
    const warnLogChannel = await client.channels.fetch("1389822687844634705");
    const muteLogChannel = await client.channels.fetch("1389822705959833731");

    try {
      if (
        !member.roles.cache.has(warning1Role) &&
        !member.roles.cache.has(warning2Role)
      ) {
        await member.roles.add(warning1Role);
        message.reply(`⚠️ ${member.user.tag} has received **Warning 1**. Reason: ${reason}`);
        await member.send(`⚠️ You have received **Warning 1** in ${message.guild.name}. Reason: ${reason}`);

        const embed = new EmbedBuilder()
          .setTitle("⚠️ Warning Issued (1)")
          .setDescription(`${member} received **Warning 1**.\nReason: ${reason}\nModerator: ${message.author}`)
          .setColor(0xffff00)
          .setTimestamp();
        warnLogChannel.send({ embeds: [embed] });

      } else if (member.roles.cache.has(warning1Role)) {
        await member.roles.remove(warning1Role);
        await member.roles.add(warning2Role);
        message.reply(`⚠️ ${member.user.tag} has received **Warning 2**. Reason: ${reason}`);
        await member.send(`⚠️ You have received **Warning 2** in ${message.guild.name}. Reason: ${reason}`);

        const embed = new EmbedBuilder()
          .setTitle("⚠️ Warning Issued (2)")
          .setDescription(`${member} received **Warning 2**.\nReason: ${reason}\nModerator: ${message.author}`)
          .setColor(0xff6600)
          .setTimestamp();
        warnLogChannel.send({ embeds: [embed] });

      } else if (member.roles.cache.has(warning2Role)) {
        await member.roles.remove(warning2Role);

        // third strike tracking
        const count = thirdStrikeCounts.get(member.id) || 0;
        thirdStrikeCounts.set(member.id, count + 1);

        let muteTime;
        if (count === 0) {
          muteTime = ms("10m");
        } else {
          muteTime = ms("1d");
        }

        await member.timeout(muteTime, "Reached 3 warnings");
        message.reply(`⏰ ${member.user.tag} reached 3 warnings and was muted for ${muteTime === ms("10m") ? "10 minutes" : "1 day"}.`);
        await member.send(`⏰ You have reached 3 warnings in ${message.guild.name} and have been muted for ${muteTime === ms("10m") ? "10 minutes" : "1 day"}.`);

        const warnEmbed = new EmbedBuilder()
          .setTitle("⚠️ Third Warning Triggered")
          .setDescription(`${member} reached 3 warnings and was muted for ${muteTime === ms("10m") ? "10 minutes" : "1 day"}.\nModerator: ${message.author}`)
          .setColor(0xff3300)
          .setTimestamp();
        warnLogChannel.send({ embeds: [warnEmbed] });

        const muteEmbed = new EmbedBuilder()
          .setTitle("🔇 Member Muted (Third Warning)")
          .setDescription(`${member} was muted for ${muteTime === ms("10m") ? "10 minutes" : "1 day"} after 3 warnings.\nModerator: ${message.author}`)
          .setColor(0xff0000)
          .setTimestamp();
        muteLogChannel.send({ embeds: [muteEmbed] });
      }
    } catch (err) {
      console.error(err);
      message.reply("❌ There was an error applying the warning or mute.");
    }
  }

  //
  // CLEAR WARNS
  //
  if (message.content.startsWith(".clearwarns")) {
    if (!message.member.roles.cache.has("1389084794809356298")) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("⚠️ Please mention a valid user to clear warnings.");
    }

    const warning1Role = "1389821233562124329";
    const warning2Role = "1389821226251456552";
    const warnLogChannel = await client.channels.fetch("1389822687844634705");

    try {
      if (member.roles.cache.has(warning1Role)) {
        await member.roles.remove(warning1Role);
      }
      if (member.roles.cache.has(warning2Role)) {
        await member.roles.remove(warning2Role);
      }

      thirdStrikeCounts.delete(member.id);

      message.reply(`✅ Cleared all warnings for ${member.user.tag}.`);
      const embed = new EmbedBuilder()
        .setTitle("✅ Warnings Cleared")
        .setDescription(`${member} had their warnings cleared.\nModerator: ${message.author}`)
        .setColor(0x00cc66)
        .setTimestamp();
      warnLogChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("❌ There was an error clearing this member's warnings.");
    }
  }

  //
  // KICK
  //
  if (message.content.startsWith(".kick")) {
    if (!message.member.roles.cache.has("1389091532912463992")) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    const args = message.content.slice(5).trim().split(/ +/);
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!member) {
      return message.reply("⚠️ Please mention a valid user to kick.");
    }

    try {
      await member.kick(reason);
      message.reply(`✅ ${member.user.tag} has been kicked. Reason: ${reason}`);

      const logChannel = await client.channels.fetch("1389822723248754689");
      const embed = new EmbedBuilder()
        .setTitle("👢 Member Kicked")
        .setDescription(`${member} was kicked.\nReason: ${reason}\nModerator: ${message.author}`)
        .setColor(0xff4444)
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("❌ I could not kick that member. Check my permissions and role hierarchy.");
    }
  }

  //
  // BAN
  //
  if (message.content.startsWith(".ban")) {
    if (!message.member.roles.cache.has("1389091532912463992")) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    const args = message.content.slice(4).trim().split(/ +/);
    const member = message.mentions.members.first();
    const durationOrReason = args[1];
    let duration;
    let reason;

    if (ms(durationOrReason)) {
      duration = ms(durationOrReason);
      reason = args.slice(2).join(" ") || "No reason provided";
    } else {
      duration = null;
      reason = args.slice(1).join(" ") || "No reason provided";
    }

    if (!member) {
      return message.reply("⚠️ Please mention a valid user to ban.");
    }

    try {
      await member.ban({ reason });
      message.reply(`✅ ${member.user.tag} has been banned. Reason: ${reason}`);

      const logChannel = await client.channels.fetch("1389822733302497370");
      const embed = new EmbedBuilder()
        .setTitle("🔨 Member Banned")
        .setDescription(`${member} was banned.\nReason: ${reason}\nModerator: ${message.author}`)
        .setColor(0xcc0000)
        .setTimestamp();
      logChannel.send({ embeds: [embed] });

      if (duration) {
        setTimeout(async () => {
          try {
            await message.guild.members.unban(member.id, "Temporary ban expired");
            const unbanEmbed = new EmbedBuilder()
              .setTitle("✅ Member Unbanned")
              .setDescription(`${member.user.tag} was unbanned after temporary ban.\nModerator: Auto`)
              .setColor(0x00cc66)
              .setTimestamp();
            logChannel.send({ embeds: [unbanEmbed] });
          } catch (err) {
            console.error(err);
          }
        }, duration);
      }
    } catch (err) {
      console.error(err);
      message.reply("❌ I could not ban that member. Check my permissions and role hierarchy.");
    }
  }

});

client.login(TOKEN);

