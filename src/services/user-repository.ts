import { IUser, UserModel } from '../models/user.js';
import { logger } from "../logger.js";

export class UserRepository {
    static async addUser(userDiscordId: string, userBojId: string): Promise<boolean> {
        try {
            const user = new UserModel({
                discord_id: userDiscordId,
                boj_id: userBojId,
            });
            await user.save();
            logger.info(`Adding user ${userDiscordId} with boj id ${userBojId}`);
            return true;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return false;
        }
    }

    static async deleteUser(userDiscordId: string): Promise<boolean> {
        try {
            await UserModel.deleteOne({discord_id: userDiscordId});
            logger.info(`Deleting user ${userDiscordId}`);
            return true;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return false;
        }
    }

    static async modifyBojIdOfUser(userDiscordId: string, userBojId: string): Promise<boolean> {
        try {
            await UserModel.updateOne({discord_id: userDiscordId}, {boj_id: userBojId});
            logger.info(`Modifying boj id of user ${userDiscordId} to ${userBojId}`);
            return true;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return false;
        }
    }

    static async addTime(userDiscordId: string, userDailyTime: string): Promise<boolean> {
        try {
            await UserModel.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime});
            logger.info(`Adding time ${userDailyTime} to user ${userDiscordId}`);
            return true;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return false;
        }
    }

    static async deleteTime(userDiscordId: string): Promise<boolean> {
        try {
            await UserModel.updateOne({discord_id: userDiscordId}, {daily_time: null});
            logger.info(`Deleting time of user ${userDiscordId}`);
            return true;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return false;
        }
    }

    static async modifyTime(userDiscordId: string, userDailyTime: string): Promise<boolean> {
        try {
            await UserModel.updateOne({discord_id: userDiscordId}, {daily_time: userDailyTime});
            logger.info(`Modifying time of user ${userDiscordId} to ${userDailyTime}`);
            return true;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return false;
        }
    }

    static async findByDiscordId(userDiscordId: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({discord_id: userDiscordId});
            logger.info(`Finding user ${userDiscordId}`);
            return user ?? null;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return null;
        }
    }

    static async findByDailyTime(userDailyTime: string): Promise<IUser[]> {
        try {
            const users = await UserModel.find({daily_time: userDailyTime});
            logger.info(`Finding users with time ${userDailyTime}`);
            return users;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return [];
        }
    }

    static async findAll(): Promise<IUser[]> {
        try {
            const users = await UserModel.find({});
            logger.info(`Finding all users`);
            return users;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return [];
        }
    }
}
