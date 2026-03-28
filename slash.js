const { REST, Routes } = require('discord.js');
require("dotenv").config();

const CLIENT_ID = "1486105293455888506";
const GUILD_ID = "1486105549786316943";

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

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
await rest.put(
Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
{ body: commands }
);
console.log("✅ slash ready");
})();