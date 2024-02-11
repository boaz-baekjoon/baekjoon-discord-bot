import {Client, Collection, GatewayIntentBits, Interaction} from 'discord.js';
import { sendDailyProblem } from './bot/cron.js'
import * as cron from 'node-cron';
import { logger } from './logger.js'
import {initializeBot} from "./bot/initialize-bot.js";
import {embedWelcome} from "./embedMessage/guideMessage.js";
import {MongoUtil} from "./util/mongoUtil.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, any>
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
    logger.info(`Successfully Initialized at ${Date.now()}`)
})


const userCommandStatus = {}

client.on("guildCreate", async(guild) => {
    let channel: any = guild.channels.cache.find(channel => channel.type === 0);
    logger.info(`${guild.ownerId} Uses Baekjoon bot newly`)
    if (!channel){
        logger.warn(`${guild.ownerId} / No chat channel found`)
        return;
    }
    //Send welcome message
    channel.send({embeds: [embedWelcome]});
})

client.on('guildDelete', async(guild) => {
    try{
        await MongoUtil.deleteUser(guild.ownerId);
        logger.info(`${guild.ownerId} / Bot is removed from guild`)
    }catch (error){
        logger.error(error);
    }
});

client.on('interactionCreate', async (interaction: Interaction) => {
    try{
        if (!interaction.isChatInputCommand()) return;
        logger.verbose(`Command: ${interaction.commandName} / User: ${interaction.user.id}`)

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        await command.default.execute(interaction);
    }catch (error){
        console.error(error);
    }
})

cron.schedule('* * * * *', function(){
    logger.verbose("Running cron job")
    sendDailyProblem(client).then(r =>
        logger.verbose(r)
    ).catch(error =>{
        logger.error(error)
    })
});


