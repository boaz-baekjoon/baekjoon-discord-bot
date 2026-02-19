import { ApplicationCommandDataResolvable, Client, Collection, REST, Routes } from "discord.js";
import { mongoConnect } from "../config/database.js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { logger } from "../logger.js";

export async function initializeBot(client: Client): Promise<void> {
    dotenv.config();

    client.commands = new Collection();

    await client.login(process.env.DISCORD_TOKEN);
    logger.info("Discord Bot Logged In");

    await mongoConnect();

    const allFiles = fs.readdirSync("./dist/commands").filter(file => file.endsWith(".js"));
    const adminFiles = allFiles.filter(file => file.startsWith("admin"));
    const publicFiles = allFiles.filter(file => !file.startsWith("admin"));

    const slashCommands: ApplicationCommandDataResolvable[] = [];
    for (const file of publicFiles) {
        const commandName = file.split(".")[0];
        const command = await import(`../commands/${file}`);
        logger.info(`Loaded command: ${commandName}`);
        slashCommands.push(command.default.data);
        client.commands.set(commandName, command);
    }

    const rest = new REST({ version: "9" }).setToken(String(process.env.DISCORD_TOKEN));
    await rest.put(Routes.applicationCommands(client.user!.id), { body: slashCommands });

    const slashAdminCommands: ApplicationCommandDataResolvable[] = [];
    for (const file of adminFiles) {
        const commandName = file.split(".")[0];
        const command = await import(`../commands/${file}`);
        logger.info(`Loaded admin command: ${commandName}`);
        slashAdminCommands.push(command.default.data);
        client.commands.set(commandName, command);
    }
    await rest.put(
        Routes.applicationGuildCommands(client.user!.id, String(process.env.ADMIN_SERVER)),
        { body: slashAdminCommands }
    );

    client.once('ready', () => {
        logger.info("BOJ Bot is ready");
    });
}
