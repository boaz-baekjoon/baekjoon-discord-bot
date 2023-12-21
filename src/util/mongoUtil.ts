import * as mongoose from 'mongoose';
import { User } from '../schema/user';
import {logger} from "../logger";

export class MongoUtil{
    async addUser(userDiscordId: string, userBojId: string): Promise<Boolean>{
        try{
            const user = new User({
                discord_id: userDiscordId,
                boj_id: userBojId,
            });
            await user.save();
            logger.info(`Adding user ${userDiscordId} with boj id ${userBojId}`);
            return true;
        }catch (error){
            logger.error(error.message);
        }
        return false;
    }

    async deleteUser(userDiscordId: string): Promise<Boolean>{
        try{
            await User.deleteOne({discord_id: userDiscordId});
            logger.info(`Deleting user ${userDiscordId}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
        return false;
    }

    async modifyBojIdOfUser(userDiscordId: string, userBojId: string): Promise<Boolean>{
        try {
            await User.updateOne({discord_id: userDiscordId}, {boj_id: userBojId});
            logger.info(`Modifying boj id of user ${userDiscordId} to ${userBojId}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
        return false;
    }

    async addTime(userDiscordId: string, userCron: string): Promise<Boolean>{
        try{
            await User.updateOne({discord_id: userDiscordId}, {cron: userCron});
            logger.info(`Adding time ${userCron} to user ${userDiscordId}`);
            return true;
        }catch (error){
            logger.error(error.message);
        }
        return false;
    }

    async deleteTime(userDiscordId: string): Promise<Boolean>{
        try {
            await User.updateOne({discord_id: userDiscordId}, {cron: null});
            logger.info(`Deleting time of user ${userDiscordId}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
        return false;
    }

    async modifyTime(userDiscordId: String, userCron: String): Promise<Boolean>{
        try {
            await User.updateOne({discord_id: userDiscordId}, {cron: userCron});
            logger.info(`Modifying time of user ${userDiscordId} to ${userCron}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
    }

    async findUserWithDiscordId(userDiscordId: string): Promise<any>{
        try {
            const user = await User.findOne({discord_id: userDiscordId});
            logger.info(`Finding user ${userDiscordId}`);
            if (user){
                return user;
            }else {
                return null;
            }
        }catch (error){
            logger.error(error.message);
        }
    }

    async findUserWithUserCron(userCron: string): Promise<any>{
        try {
            const users = await User.find({cron: userCron});
            logger.info(`Finding users with time ${userCron}`);
            if (users){
                return users;
            }else {
                return null;
            }
        }catch (error){
            logger.error(error.message);
        }
    }
}