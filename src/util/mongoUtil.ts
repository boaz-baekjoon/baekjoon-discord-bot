import * as mongoose from 'mongoose';
import { User } from '../schema/user';
import {logger} from "../logger";

export class MongoUtil{
    //map discordId and bojId, and save it to mongoDB

    static async addUser(userDiscordId: string, userBojId: string): Promise<Boolean>{
        const session = await mongoose.startSession();
        try{
            const user = new User({
                discord_id: userDiscordId,
                boj_id: userBojId,
            });
            await user.save({session: session});
            logger.info(`Adding user ${userDiscordId} with boj id ${userBojId}`);
            await session.commitTransaction();
            return true;
        }catch (error){
            logger.error(error.message);
            await session.abortTransaction();
        }finally {
            await session.endSession();
        }
        return false;
    }

    //delete user with discordId
    static async deleteUser(userDiscordId: string): Promise<Boolean>{
        try{
            await User.deleteOne({discord_id: userDiscordId});
            logger.info(`Deleting user ${userDiscordId}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
        return false;
    }

    //modify bojId of user with discordId
    static async modifyBojIdOfUser(userDiscordId: string, userBojId: string): Promise<Boolean>{
        try {
            await User.updateOne({discord_id: userDiscordId}, {boj_id: userBojId});
            logger.info(`Modifying boj id of user ${userDiscordId} to ${userBojId}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
        return false;
    }

    //add time at which user wants to get notification
    static async addTime(userDiscordId: string, userCron: string): Promise<Boolean>{
        try{
            await User.updateOne({discord_id: userDiscordId}, {cron: userCron});
            logger.info(`Adding time ${userCron} to user ${userDiscordId}`);
            return true;
        }catch (error){
            logger.error(error.message);
        }
        return false;
    }

    //deactivate daily problem notification
    static async deleteTime(userDiscordId: string): Promise<Boolean>{
        try {
            await User.updateOne({discord_id: userDiscordId}, {cron: null});
            logger.info(`Deleting time of user ${userDiscordId}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
        return false;
    }

    //modify time at which user wants to get notification, and will be executed for users who already activated daily notification
    static async modifyTime(userDiscordId: String, userCron: String): Promise<Boolean>{
        try {
            await User.updateOne({discord_id: userDiscordId}, {cron: userCron});
            logger.info(`Modifying time of user ${userDiscordId} to ${userCron}`);
            return true;
        }catch(error){
            logger.error(error.message);
        }
    }

    //find user with discordId, for checking if user already registered. BojId will be displayed if user already registered
    static async findUserWithDiscordId(userDiscordId: string): Promise<any>{
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

    //for sending daily problem notification at corresponding time
    static async findUserWithUserCron(userCron: string): Promise<any>{
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