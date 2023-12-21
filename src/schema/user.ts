import * as mongoose from 'mongoose';



interface IUser extends mongoose.Document {
    discord_id: string;
    boj_id: string;
    cron: string;
}

const UserSchema = new mongoose.Schema({
    discord_id: {type: String, required: true},
    boj_id: {type: String, required: true},
    cron: {type: String, required: false}
});

export const User = mongoose.model<IUser>('User', UserSchema, 'boj-user');
