import * as mongoose from 'mongoose';
import { User } from '../schema/user';
import {logger} from "../logger";

export class MongoUtil{
    //map discordId and bojId, and save it to mongoDB

    static async addUser(userDiscordId: string, userBojId: string): Promise<Boolean>{
        const session = await mongoose.startSession();
        session.startTransaction();
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
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            await User.deleteOne({discord_id: userDiscordId}, {session: session});
            logger.info(`Deleting user ${userDiscordId}`);
            await session.commitTransaction();
            return true;
        }catch(error){
            logger.error(error.message);
            await session.abortTransaction();
        }finally {
            await session.endSession();
        }
        return false;
    }

    //modify bojId of user with discordId
    static async modifyBojIdOfUser(userDiscordId: string, userBojId: string): Promise<Boolean>{
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await User.updateOne({discord_id: userDiscordId}, {boj_id: userBojId}, {session: session});
            logger.info(`Modifying boj id of user ${userDiscordId} to ${userBojId}`);
            await session.commitTransaction();
            return true;
        }catch(error){
            logger.error(error.message);
            await session.abortTransaction();
        }finally {
            await session.endSession();
        }
        return false;
    }

    //add time at which user wants to get notification
    static async addTime(userDiscordId: string, userDailyTime: string): Promise<Boolean>{
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            await User.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime}, {session: session});
            logger.info(`Adding time ${userDailyTime} to user ${userDiscordId}`);
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

    //deactivate daily problem notification
    static async deleteTime(userDiscordId: string): Promise<Boolean>{
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await User.updateOne({discord_id: userDiscordId}, {daily_time: null}), {session: session};
            logger.info(`Deleting time of user ${userDiscordId}`);
            await session.commitTransaction();
            return true;
        }catch(error){
            logger.error(error.message);
            await session.abortTransaction();
        }finally {
            await session.endSession();
        }
        return false;
    }

    //modify time at which user wants to get notification, and will be executed for users who already activated daily notification
    static async modifyTime(userDiscordId: String, userDailyTime: String): Promise<Boolean>{
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await User.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime});
            logger.info(`Modifying time of user ${userDiscordId} to ${userDailyTime}`);
            await session.commitTransaction();
            return true;
        }catch(error){
            logger.error(error.message);
            await session.abortTransaction();
        }finally {
            await session.endSession();
        }
        return false;
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
    static async findUserWithUserDailyTime(userDailyTime: string): Promise<any>{
        try {
            const users = await User.find({daily_time: userDailyTime});
            logger.info(`Finding users with time ${userDailyTime}`);
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