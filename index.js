require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// رتبة الايفنت
const eventRoles = ["1398804818482561035", "1398804831140839514"];

// تحقق رتبة
function hasEventRole(member) {
  return eventRoles.some(r => member.roles.cache.has(r));
}

// ===== SLASH =====
const commands = [
{ name:"vote", description:"Vote system" }
];

// ===== READY =====
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  console.log("✅ Slash ready");
});

// ===== COMMAND =====
client.on("interactionCreate", async interaction => {

if (!interaction.isChatInputCommand()) return;
if (interaction.commandName !== "vote") return;

const member = interaction.member;

// صلاحيات
if (
  !hasEventRole(member) &&
  !member.permissions.has(PermissionsBitField.Flags.Administrator)
) {
  return interaction.reply("❌ You don't have permission");
}

// وقت النهاية
let endTime = Math.floor((Date.now() + 5 * 60 * 1000) / 1000);

// ===== EMBED البداية =====
const embed = new EmbedBuilder()
.setColor("#2b2d31")
.setDescription(`
> **Powered By ( EF )**

### 🎮 Vote For Event

━━━━━━━━━━━━━━━━━━━━━━

⏳ **Voting Ends:** <t:${endTime}:R>

━━━━━━━━━━━━━━━━━━━━━━

**1️⃣ — Gang War**

**2️⃣ — Battle Royale (2v2)**

**3️⃣ — Battle Royale (4v4)**

**4️⃣ — Back To Back (1v1)**

**5️⃣ — Battle Royale (1v1)**

━━━━━━━━━━━━━━━━━━━━━━
`);

const msg = await interaction.reply({ embeds:[embed], fetchReply:true });

// ايموجيات التصويت
const emojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"];
for (let e of emojis) await msg.react(e);

// ===== بعد 5 دقائق =====
setTimeout(async () => {

await msg.reactions.removeAll();

const endedEmbed = new EmbedBuilder()
.setColor("#2b2d31")
.setDescription(`
> **Powered By ( EF )**

### 🎮 Vote For Event

━━━━━━━━━━━━━━━━━━━━━━

⏳ **Voting Ended:** Ended

━━━━━━━━━━━━━━━━━━━━━━

**1️⃣ — Gang War**

**2️⃣ — Battle Royale (2v2)**

**3️⃣ — Battle Royale (4v4)**

**4️⃣ — Back To Back (1v1)**

**5️⃣ — Battle Royale (1v1)**

━━━━━━━━━━━━━━━━━━━━━━
`);

await msg.edit({ embeds:[endedEmbed] });

}, 300000);

});

client.login(process.env.TOKEN);