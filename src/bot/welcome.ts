import { client } from '../index'
import { embedWelcome } from './guideMessage'
import { logger } from '../logger'
import {Guild, TextChannel} from "discord.js";

client.on("guildCreate", async(guild) => {
    let channel = guild.channels.cache.find(channel => channel.type === 0);
    logger.info(`${guild.ownerId} Uses Baekjoon bot newly`)
    if (!channel){
        logger.warn(`${guild.ownerId} / No chat channel found`)
        return;
    }
    //Send welcome message
    (channel as TextChannel).send({embeds: [embedWelcome]}).then(() => {
            logger.info(`${guild.ownerId} / Sent welcome message`)
        }
    ).catch(error => {
        logger.error(`${guild.ownerId} / Failed to send welcome message`)
        logger.error(error)
    }
    );
})


