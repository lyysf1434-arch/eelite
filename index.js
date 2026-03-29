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

// صلاحيات (رول أو ادمن)
if (
  !hasEventRole(member) &&
  !member.permissions.has(PermissionsBitField.Flags.Administrator)
) {
  return interaction.reply("❌ You don't have permission");
}

// وقت النهاية
let endTime = Math.floor((Date.now() + 5 * 60 * 1000) / 1000);

// ===== EMBED بداية =====
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

// ايموجيات
const emojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"];
for (let e of emojis) await msg.react(e);

// ===== بعد 5 دقائق =====
setTimeout(async () => {

let results = {};

// ⭐ FIX مهم: نجيب الريأكشن من Discord نفسه
await msg.fetch();

msg.reactions.cache.forEach(r => {
results[r.emoji.name] = r.count - 1;
});

// بعد الحساب نحذف
await msg.reactions.removeAll();

const names = {
"1️⃣":"Gang War",
"2️⃣":"Battle Royale 2v2",
"3️⃣":"Battle Royale 4v4",
"4️⃣":"Back To Back 1v1",
"5️⃣":"Battle Royale 1v1"
};

// مجموع
let total = Object.values(results).reduce((a,b)=>a+b,0);

// بار
function bar(percent) {
let filled = Math.round(percent / 10);
return "█".repeat(filled) + "░".repeat(10 - filled);
}

// عرض النتائج
let text = "";

for (let key of emojis) {
let count = results[key] || 0;
let percent = total ? Math.round((count / total) * 100) : 0;

text += `**${key} ${names[key]}**\n${bar(percent)} ${percent}%\n\n`;
}

// الفائز
let winner = "No votes";
if (total > 0) {
let win = Object.entries(results).sort((a,b)=>b[1]-a[1])[0][0];
winner = names[win];
}

// ===== EMBED نهاية =====
const endedEmbed = new EmbedBuilder()
.setColor("Gold")
.setDescription(`
> **Powered By ( EF )**

### 🎮 Vote For Event

━━━━━━━━━━━━━━━━━━━━━━

⏳ **Voting Ended:** It's Ended

━━━━━━━━━━━━━━━━━━━━━━

${text}

━━━━━━━━━━━━━━━━━━━━━━

🏆 **Winner**
\`\`\`
${winner}
\`\`\`
`);

await msg.edit({ embeds:[endedEmbed] });

}, 300000);

});

client.login(process.env.TOKEN);