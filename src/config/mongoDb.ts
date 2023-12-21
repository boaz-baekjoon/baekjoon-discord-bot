import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config()

export const mongoConnect = () => {
    try{
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
    }catch (error){
        console.error(error)
    }
}

