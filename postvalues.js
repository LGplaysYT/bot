const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1389407341924974684";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const items = [
{ name: "2B Gun", value: "25,000" },
  { name: "Dragon Breathe Knife", value: "25,000" },
  { name: "Splatter Gun", value: "30,000" },
  { name: "Frosthorn Knife", value: "30,000" },
  { name: "Bat Scythe Knife", value: "35,000" },
  { name: "Harmonic Knife", value: "35,000" },
  { name: "Reaper Knife", value: "35,000" },
  { name: "Saber Knife", value: "35,000" },
  { name: "Techno Knife", value: "35,000" },
  { name: "Winx Knife", value: "35,000" },
  { name: "Celestial Knife", value: "40,000" },
  { name: "Rosethorn Knife", value: "40,000" },
  { name: "Willow Knife", value: "40,000" },
  { name: "Void Crossbow Gun", value: "40,000" },
  { name: "Willow 🍃 Knife", value: "40,000" },
  { name: "Reaper 🍃 Knife", value: "50,000" },
  { name: "Mermaid Gun", value: "50,000" },
  { name: "Frosthorn Gun", value: "55,000" },
  { name: "🍃 Fang Gun 🍃", value: "55,000" },
  { name: "Leprechaun Gun", value: "55,000" },
  { name: "Angel Knife", value: "60,000" },
  { name: "Rhinestone Knife", value: "60,000" },
  { name: "🍃 Fang Knife 🍃", value: "60,000" },
  { name: "Reaper Gun", value: "65,000" },
  { name: "Harmonic Gun", value: "70,000" },
  { name: "Ice Pegasus Knife (all colors)", value: "70,000" },
  { name: "Mermaid Knife (all colors)", value: "70,000" },
  { name: "Nebula Knife (all colors)", value: "70,000" },
  { name: "Flutter Gun", value: "80,000" },
  { name: "Celestial Gun", value: "85,000" },
  { name: "Ice Pegasus Gun (all colors)", value: "85,000" },
  { name: "Fang Axe (all colors)", value: "90,000" },
  { name: "Frostbite Knife", value: "100,000" },
  { name: "Fang Gun (all colors)", value: "110,000" },
  { name: "Flutter Gun (all colors)", value: "115,000" },
  { name: "Green Ornament Knife", value: "120,000" },
  { name: "Red Rhinestone Knife", value: "125,000" },
  { name: "Red Ornament Knife", value: "130,000" },
  { name: "Blue Ornament Knife", value: "130,000" },
  { name: "Blue Rhinestone Knife", value: "130,000" },
  { name: "Black Rhinestone Knife", value: "130,000" },
  { name: "Purple Ornament Knife", value: "135,000" },
  { name: "Purple Rhinestone Knife", value: "140,000" },
  { name: "Green Ornament Gun", value: "200,000" },
  { name: "Red Rhinestone Gun", value: "205,000" },
  { name: "Blue Rhinestone Gun", value: "210,000" },
  { name: "Black Rhinestone Gun", value: "210,000" },
  { name: "Purple Rhinestone Gun", value: "215,000" },
  { name: "Red Ornament Gun", value: "215,000" },
  { name: "Blue Ornament Gun", value: "215,000" },
  { name: "Purple Ornament Gun", value: "220,000" },
  { name: "Red Peppermint Knife", value: "225,000" },
  { name: "Blue Peppermint Knife", value: "230,000" },
  { name: "Red Dragonfire Knife", value: "330,000" },
  { name: "Blue Dragonfire Knife", value: "335,000" },
  { name: "Red Peppermint Gun", value: "345,000" },
  { name: "Blue Peppermint Gun", value: "350,000" },
  { name: "Black Dragonfire Knife", value: "410,000" },
  { name: "Purple Dragonfire Knife", value: "420,000" },
  { name: "Red Dragonfire Gun", value: "500,000" },
  { name: "Blue Dragonfire Gun", value: "510,000" },
  { name: "Purple Peppermint Gun", value: "580,000" },
  { name: "Black Dragonfire Gun", value: "670,000" },
  { name: "Purple Dragonfire Gun", value: "690,000" },
  { name: "Reef Knife", value: "740,000" },
  { name: "Green Peppermint Gun", value: "895,000" },
  { name: "Rosethorn Gun", value: "930,000" },
  { name: "Green Peppermint Knife", value: "945,000" },
  { name: "Green Willow Knife", value: "1,050,000" },
  { name: "Yellow Strife Knife", value: "1,080,000" },
  { name: "Red Willow Knife", value: "1,210,000" },
  { name: "Frostbite Gun", value: "1,360,000" },
  { name: "Green Strife Knife", value: "1,470,000" },
  { name: "Red Strife Knife", value: "1,620,000" },
  { name: "Purple Willow Knife", value: "1,790,000" },
  { name: "Reef Gun", value: "2,150,000" },
  { name: "Purple Strife Knife", value: "2,300,000" },
  { name: "Blue Willow Knife", value: "2,370,000" },
  { name: "Green Willow Gun", value: "3,020,000" },
  { name: "Yellow Strife Gun", value: "3,900,000" },
  { name: "Red Willow Gun", value: "4,050,000" },
  { name: "Green Strife Gun", value: "5,350,000" },
  { name: "Red Strife Gun", value: "5,800,000" },
  { name: "Purple Willow Gun", value: "6,150,000" },
  { name: "Purple Strife Gun", value: "9,720,000" },
  { name: "Blue Willow Gun", value: "10,100,000" }
];

client.once('ready', async () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);

  const knives = items
    .filter(item => item.name.toLowerCase().includes("knife"))
    .sort((a, b) => parseInt(a.value.replace(/,/g, "")) - parseInt(b.value.replace(/,/g, "")));

  const guns = items
    .filter(item => item.name.toLowerCase().includes("gun") || item.name.toLowerCase().includes("crossbow"))
    .sort((a, b) => parseInt(a.value.replace(/,/g, "")) - parseInt(b.value.replace(/,/g, "")));

  const channel = await client.channels.fetch(CHANNEL_ID);
  const chunkSize = 25;

  // knives
  for (let i = 0; i < knives.length; i += chunkSize) {
    const chunk = knives.slice(i, i + chunkSize);
    const embed = new EmbedBuilder()
      .setTitle("🔪 MVSD Knife Values")
      .setDescription(`Showing **${knives.length}** knives (part ${Math.floor(i/chunkSize)+1})`)
      .setColor(0xFF0000)
      .setTimestamp();

    chunk.forEach(item => {
      embed.addFields({ name: item.name, value: item.value, inline: true });
    });

    await channel.send({ embeds: [embed] });
  }

  // guns
  for (let i = 0; i < guns.length; i += chunkSize) {
    const chunk = guns.slice(i, i + chunkSize);
    const embed = new EmbedBuilder()
      .setTitle("🔫 MVSD Gun Values")
      .setDescription(`Showing **${guns.length}** guns (part ${Math.floor(i/chunkSize)+1})`)
      .setColor(0xFF0000)
      .setTimestamp();

    chunk.forEach(item => {
      embed.addFields({ name: item.name, value: item.value, inline: true });
    });

    await channel.send({ embeds: [embed] });
  }

  console.log("✅ All chunks posted!");
  client.destroy();
});

client.login(TOKEN);
