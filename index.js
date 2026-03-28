require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const eventRoles = ["1398804818482561035", "1398804831140839514"];
const registerChannelID = "1486929573332648007";
const teamsLogChannelID = "1486929591648911441";

const maps = {
"1️⃣": { name: "Scrap", image: "https://i.imgur.com/1.jpg" },
"2️⃣": { name: "RunGan", image: "https://i.imgur.com/2.jpg" },
"3️⃣": { name: "Cinema", image: "https://i.imgur.com/3.jpg" },
"4️⃣": { name: "Map 4", image: "https://i.imgur.com/4.jpg" }
};

const games = {
"1️⃣": "Battle Royal",
"2️⃣": "Back to Back",
"3️⃣": "Gang War"
};

function hasEventRole(member) {
  return eventRoles.some(r => member.roles.cache.has(r));
}

// ===== SLASH COMMANDS =====
const commands = [
{ name:"rules", description:"القوانين" },
{ name:"maps", description:"تصويت المابات" },
{ name:"games", description:"تصويت القيم" },
{ name:"startvote", description:"تصويت كامل" },
{ name:"teams-open", description:"فتح التيمات" },
{ name:"teams-close", description:"قفل التيمات" },
{ name:"distribute", description:"توزيع" },
{
name:"winners",
description:"الفائزين",
options:[
{ name:"event", type:3, required:true, description:"اسم الفعالية"},
{ name:"host", type:3, required:true, description:"المنظم"},
{ name:"players", type:3, required:true, description:"الفائزين"}
]
}
];

// ===== READY =====
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Slash commands registered");
  } catch (err) {
    console.error(err);
  }
});

// ===== INTERACTIONS =====
client.on("interactionCreate", async interaction => {

if (!interaction.isChatInputCommand()) return;

const cmd = interaction.commandName;

// RULES
if (cmd === "rules") {
await interaction.reply("@everyone 📜 قوانين الايفنت");
}

// MAPS
if (cmd === "maps") {

if (!hasEventRole(interaction.member)) return interaction.reply("❌ ليس لديك صلاحية");

const embed = new EmbedBuilder()
.setTitle("🗳️ تصويت المابات")
.setDescription("1️⃣ Scrap\n2️⃣ RunGan\n3️⃣ Cinema\n4️⃣ Map 4");

const msg = await interaction.reply({ embeds:[embed], fetchReply:true });

for (let e of Object.keys(maps)) await msg.react(e);

setTimeout(()=>{
msg.reactions.removeAll();

let res={};
msg.reactions.cache.forEach(r=> res[r.emoji.name]=r.count-1);

if (!Object.keys(res).length) return interaction.followUp("❌ ما فيه تصويت");

const win = Object.entries(res).sort((a,b)=>b[1]-a[1])[0][0];

interaction.followUp({
embeds:[ new EmbedBuilder()
.setTitle("🏆 الماب الفائز")
.setDescription(maps[win].name)
.setImage(maps[win].image)]
});

},300000);
}

// GAMES
if (cmd === "games") {

if (!hasEventRole(interaction.member)) return interaction.reply("❌ ليس لديك صلاحية");

const embed = new EmbedBuilder()
.setTitle("🎮 تصويت القيم")
.setDescription("1️⃣ Battle Royal\n2️⃣ Back to Back\n3️⃣ Gang War");

const msg = await interaction.reply({ embeds:[embed], fetchReply:true });

for (let e of Object.keys(games)) await msg.react(e);

setTimeout(()=>{
msg.reactions.removeAll();

let res={};
msg.reactions.cache.forEach(r=> res[r.emoji.name]=r.count-1);

if (!Object.keys(res).length) return interaction.followUp("❌ ما فيه تصويت");

const win = Object.entries(res).sort((a,b)=>b[1]-a[1])[0][0];

interaction.followUp(`🏆 الفائز: ${games[win]}`);

},300000);
}

// STARTVOTE
if (cmd === "startvote") {

if (!hasEventRole(interaction.member)) return;

await interaction.reply("🚀 بدأ التصويت...");
}

// WINNERS
if (cmd === "winners") {

const event = interaction.options.getString("event");
const host = interaction.options.getString("host");
const players = interaction.options.getString("players");

await interaction.reply({
embeds:[ new EmbedBuilder()
.setTitle("🏆 الفائزين")
.setDescription(`🎮 ${event}\n👑 ${players}\n🎙️ ${host}`)
.setColor("Gold")]
});
}

});

client.login(process.env.TOKEN);