import * as mongoose from 'mongoose';
import { Mongodb_user_schema } from '../model/mongodb_user_schema.js';
import {logger} from "../logger.js";
import {Problem} from "../model/problem_schema.js";
import {BojProblem} from "../model/problem_class.js";
import {ClientSession} from "typeorm";

export class MongoUtil{
    //map discordId and bojId, and save it to mongoDB
    static async addUser(userDiscordId: string, userBojId: string): Promise<boolean>{
        try{
            const user = new Mongodb_user_schema({
                discord_id: userDiscordId,
                boj_id: userBojId,
            });
            await user.save();
            logger.info(`Adding user ${userDiscordId} with boj id ${userBojId}`);
            return true;
        }catch (error: any){
            logger.error(error.message);
            return false;
        }
    }

    //delete user with discordId
    static async deleteUser(userDiscordId: string): Promise<boolean>{
        try{
            await Mongodb_user_schema.deleteOne({discord_id: userDiscordId});
            logger.info(`Deleting user ${userDiscordId}`);
            return true;
        }catch(error: any){
            logger.error(error.message);
            return false;
        }
    }

    //modify bojId of user with discordId
    static async modifyBojIdOfUser(userDiscordId: string, userBojId: string): Promise<boolean>{
        try {
            await Mongodb_user_schema.updateOne({discord_id: userDiscordId}, {boj_id: userBojId});
            logger.info(`Modifying boj id of user ${userDiscordId} to ${userBojId}`);
            return true;
        }catch(error: any) {
            logger.error(error.message);
            return false;
        }
    }

    //add time at which user wants to get notification
    static async addTime(userDiscordId: string, userDailyTime: string): Promise<boolean>{
        try{
            await Mongodb_user_schema.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime});
            logger.info(`Adding time ${userDailyTime} to user ${userDiscordId}`);
            return true;
        }catch (error: any){
            logger.error(error.message);
            return false;
        }
    }

    //deactivate daily problem notification
    static async deleteTime(userDiscordId: string): Promise<boolean>{
        try {
            await Mongodb_user_schema.updateOne({discord_id: userDiscordId}, {daily_time: null});
            logger.info(`Deleting time of user ${userDiscordId}`);
            return true;
        }catch(error: any){
            logger.error(error.message);
            return false;
        }
    }

    //modify time at which user wants to get notification, and will be executed for users who already activated daily notification
    static async modifyTime(userDiscordId: String, userDailyTime: String): Promise<boolean>{
        try {
            await Mongodb_user_schema.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime});
            logger.info(`Modifying time of user ${userDiscordId} to ${userDailyTime}`);
            return true;
        }catch(error: any){
            logger.error(error.message);
            return false;
        }
    }

    //find user with discordId, for checking if user already registered. BojId will be displayed if user already registered
    static async findUserWithDiscordId(userDiscordId: string): Promise<any>{
        try {
            const user = await Mongodb_user_schema.findOne({discord_id: userDiscordId});
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
            const users = await Mongodb_user_schema.find({daily_time: userDailyTime});
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