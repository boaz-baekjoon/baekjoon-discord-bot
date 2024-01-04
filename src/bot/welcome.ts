import { client } from '../index.js'
import { embedWelcome } from '../embedMessage/guideMessage.js'
import { logger } from '../logger.js'
import {Guild, TextChannel} from "discord.js";

client.on("guildCreate", async(guild: Guild) => {
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


