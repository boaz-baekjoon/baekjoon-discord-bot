import mongoose from 'mongoose';

export interface IUser {
    discord_id: string;
    boj_id: string;
    daily_time?: string | null;
}

const UserSchema = new mongoose.Schema<IUser>({
    discord_id: {type: String, required: true},
    boj_id: {type: String, required: true},
    daily_time: {type: String, required: false}
});

export const UserModel = mongoose.model<IUser>('Mongodb_use_schema', UserSchema, 'boj_user');
