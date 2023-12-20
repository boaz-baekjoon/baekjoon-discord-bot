import * as mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL)
    .then(r =>
    console.log("Connected to MongoDB")
    ).catch(error =>{
        console.error(error);
    });

const db = mongoose.connection;

db.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

db.once('open', function () {
    console.log('Mongoose connected successfully');
});

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

export const User = mongoose.model<IUser>('User', UserSchema);
