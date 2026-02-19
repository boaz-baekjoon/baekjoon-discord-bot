import { ChannelType, Client, Collection, GatewayIntentBits, Interaction, TextChannel } from 'discord.js';
import { sendDailyProblem } from './bot/cron.js';
import * as cron from 'node-cron';
import { logger } from './logger.js';
import { initializeBot } from "./bot/initialize.js";
import { embedWelcome } from "./embeds/guide.js";
import { UserRepository } from "./services/user-repository.js";
import type { BotCommand } from "./types.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, { default: BotCommand }>;
    }
}

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
});

initializeBot(client).then(() => {
    logger.info(`Successfully Initialized at ${Date.now()}`);
}).catch((error) => {
    logger.error(`Failed to initialize bot: ${error}`);
    process.exit(1);
});

client.on("guildCreate", async (guild) => {
    const channel = guild.channels.cache.find(
        (ch) => ch.type === ChannelType.GuildText
    ) as TextChannel | undefined;
    logger.info(`${guild.ownerId} Uses Baekjoon bot newly`);
    if (!channel) {
        logger.warn(`${guild.ownerId} / No chat channel found`);
        return;
    }
    await channel.send({embeds: [embedWelcome]});
});

client.on('guildDelete', async (guild) => {
    try {
        await UserRepository.deleteUser(guild.ownerId);
        logger.info(`${guild.ownerId} / Bot is removed from guild`);
    } catch (error) {
        logger.error(error);
    }
});

client.on('interactionCreate', async (interaction: Interaction) => {
    try {
        if (!interaction.isChatInputCommand()) return;
        logger.verbose(`Command: ${interaction.commandName} / User: ${interaction.user.id}`);

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        await command.default.execute(interaction);
    } catch (error) {
        logger.error(error);
    }
});

cron.schedule('* * * * *', () => {
    logger.verbose("Running cron job");
    sendDailyProblem(client).catch((error) => {
        logger.error(error);
    });
});
