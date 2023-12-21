import * as mongoose from 'mongoose';



interface IUser extends mongoose.Document {
    discordId: string;
    bojId: string;
    dailyTime: string;
}

const UserSchema = new mongoose.Schema({
    discordId: {type: String, required: true},
    bojId: {type: String, required: true},
    dailyTime: {type: String, required: true}
});

export const User = mongoose.model<IUser>('User', UserSchema, 'boj-user');
