import {Client, Collection, GatewayIntentBits} from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "fs";

export async function initializeBot(client: Client){
    dotenv.config();
    try{
        //Set default collections for commands
        client.commands = new Collection();

        //Login Discord bot with Discord_Token
        await client.login(process.env.DISCORD_TOKEN);
        console.log("Discord Bot Logged In")

        //Loading Commands
        const commands = fs.readdirSync("./src/commands").filter(file => file.endsWith(".ts"));
        for (const file of commands) {
            const commandName = file.split(".")[0];
            const command = require(`../commands/${file}`);

            console.log(`Attempting to load command ${commandName}`);
            client.commands.set(commandName, command);
        }

        //Initialize Success
        client.once('ready', async () => {
            console.log("BOJ Bot is ready")
        })
    }catch (error){
        console.error(error)
    }
}
