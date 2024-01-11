import * as mongoose from 'mongoose';



interface IUser extends mongoose.Document {
    discord_id: string;
    boj_id: string;
    daily_time: string;
}

const UserSchema = new mongoose.Schema({
    discord_id: {type: String, required: true},
    boj_id: {type: String, required: true},
    daily_time: {type: String, required: false}
});

export const Mongodb_use_schema = mongoose.model<IUser>('Mongodb_use_schema', UserSchema, 'boj_user');
