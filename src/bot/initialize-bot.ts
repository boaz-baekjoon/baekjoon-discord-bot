import {ApplicationCommandDataResolvable, Client, Collection, GatewayIntentBits, REST, Routes} from "discord.js";
import { mongoConnect } from "../config/mongoDb.js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import {exit} from "process";

export async function initializeBot(client: Client){
    dotenv.config();
    try{
        //Set default collections for commands
        client.commands = new Collection();

        //Login Discord bot with Discord_Token
        await client.login(process.env.DISCORD_TOKEN);
        console.log("Discord Bot Logged In")

        //Connect to MongoDB
        mongoConnect();

        //Loading Commands
        const commands = fs.readdirSync("./dist/commands").filter(file => file.endsWith(".js")).filter(file => file !== "adminMessage.js")
        const slashCommands = new Array<ApplicationCommandDataResolvable>();
        for (const file of commands) {
            const commandName = file.split(".")[0];
            const command = await import(`../commands/${file}`);

            console.log(`Attempting to load command ${commandName}`);
            slashCommands.push(command.default.data);
            client.commands.set(commandName, command);
        }
        const rest = new REST({ version: "9" }).setToken(String(process.env.DISCORD_TOKEN));
        const response = await rest.put(Routes.applicationCommands(client.user!.id), { body: slashCommands });

        //adminCommand
        const adminCommand = await import("../commands/adminMessage.js");
        const adminCommandData = adminCommand.default.data;
        await rest.put(Routes.applicationGuildCommands(client.user!.id, String(process.env.ADMIN_SERVER)), { body: [adminCommandData.toJSON()] });


        //Initialize Success
        client.once('ready', async () => {
            console.log("BOJ Bot is ready")
        })
    }catch (error){
        console.error(error);
        exit(0);
    }
}
