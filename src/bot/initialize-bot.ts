import {Client, Collection, GatewayIntentBits} from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();
export async function initializeBot(client: Client){
    //Set default collections for commands
    client.commands = new Collection();

    //Login Discord bot with Discord_Token
    await client.login(process.env.DISCORD_TOKEN);

    //Loading Commands
    const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
    for (const file of commands) {
        const commandName = file.split(".")[0];
        const command = require(`./commands/${file}`);

        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, command);
    }

    //Initialize Success
    client.once('ready', async () => {
        console.log("BOJ Bot is ready")
    })
}
