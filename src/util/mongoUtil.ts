import * as mongoose from 'mongoose';
import { User } from '../schema/user.js';
import {logger} from "../logger.js";
import {Problem} from "../schema/problem_schema.js";
import {BojProblem} from "../schema/problem_class.js";
import {ClientSession} from "typeorm";

export class MongoUtil{
    //map discordId and bojId, and save it to mongoDB
    static async addUser(userDiscordId: string, userBojId: string): Promise<boolean>{
        let session: mongoose.mongo.ClientSession = new mongoose.mongo.ClientSession();
        try{
            session = await mongoose.startSession();
            session.startTransaction();

            const user = new User({
                discord_id: userDiscordId,
                boj_id: userBojId,
            });
            await user.save({session: session});
            logger.info(`Adding user ${userDiscordId} with boj id ${userBojId}`);
            await session.commitTransaction();
            return true;
        }catch (error: any){
            if(session){
                await session.abortTransaction();
            }
            logger.error(error.message);
            return false;
        }finally {
            if (session){
                await session.endSession();
            }
        }
    }

    //delete user with discordId
    static async deleteUser(userDiscordId: string): Promise<boolean>{
        let session: mongoose.mongo.ClientSession = new mongoose.mongo.ClientSession();
        try{
            session = await mongoose.startSession();
            session.startTransaction();

            await User.deleteOne({discord_id: userDiscordId}, {session: session});
            logger.info(`Deleting user ${userDiscordId}`);
            await session.commitTransaction();
            return true;
        }catch(error: any){
            if(session){
                await session.abortTransaction();
            }
            logger.error(error.message);
            return false;
        }finally {
            if (session){
                await session.endSession();
            }
        }
    }

    //modify bojId of user with discordId
    static async modifyBojIdOfUser(userDiscordId: string, userBojId: string): Promise<boolean>{
        let session: mongoose.mongo.ClientSession = new mongoose.mongo.ClientSession();
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            await User.updateOne({discord_id: userDiscordId}, {boj_id: userBojId}, {session: session});
            logger.info(`Modifying boj id of user ${userDiscordId} to ${userBojId}`);
            await session.commitTransaction();
            return true;
        }catch(error: any){
            if(session){
                await session.abortTransaction();
            }
            logger.error(error.message);
            return false;
        }finally {
            if (session){
                await session.endSession();
            }
        }
    }

    //add time at which user wants to get notification
    static async addTime(userDiscordId: string, userDailyTime: string): Promise<boolean>{
        let session: mongoose.mongo.ClientSession = new mongoose.mongo.ClientSession();
        try{
            session = await mongoose.startSession();
            session.startTransaction();

            await User.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime}, {session: session});
            logger.info(`Adding time ${userDailyTime} to user ${userDiscordId}`);
            await session.commitTransaction();
            return true;
        }catch (error: any){
            if(session){
                await session.abortTransaction();
            }
            logger.error(error.message);
            return false;
        }finally {
            if (session){
                await session.endSession();
            }
        }
    }

    //deactivate daily problem notification
    static async deleteTime(userDiscordId: string): Promise<boolean>{
        let session: mongoose.mongo.ClientSession = new mongoose.mongo.ClientSession();
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            await User.updateOne({discord_id: userDiscordId}, {daily_time: null}), {session: session};
            logger.info(`Deleting time of user ${userDiscordId}`);
            await session.commitTransaction();
            return true;
        }catch(error: any){
            if(session){
                await session.abortTransaction();
            }
            logger.error(error.message);
            return false;
        }finally {
            if (session){
                await session.endSession();
            }
        }
    }

    //modify time at which user wants to get notification, and will be executed for users who already activated daily notification
    static async modifyTime(userDiscordId: String, userDailyTime: String): Promise<boolean>{
        let session: mongoose.mongo.ClientSession = new mongoose.mongo.ClientSession();
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            await User.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime});
            logger.info(`Modifying time of user ${userDiscordId} to ${userDailyTime}`);
            await session.commitTransaction();
            return true;
        }catch(error: any){
            if(session){
                await session.abortTransaction();
            }
            logger.error(error.message);
            return false;
        }finally {
            if (session){
                await session.endSession();
            }
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
        }catch (error: any){
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
        }catch (error: any){
            logger.error(error.message);
        }
    }

    //find problem with problemId
    static async findProblemWithProblemId(problemId: number): Promise<any>{
        try {
            const problem = await Problem.find({problem_id: problemId});
            if (problem) {
                const {problem_id, problem_title, problem_level, tag_key} = problem[0];
                const tags = problem.map((problem: any) => problem.tag_key);

                return new BojProblem(problem_id, problem_title, problem_level, tags);
            }
        }catch (error: any){
            logger.error(error);
        }
        return null;
    }
}