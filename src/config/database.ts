import mongoose from "mongoose";
import { logger } from "../logger.js";

export async function mongoConnect(): Promise<void> {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
        throw new Error("DB_URL environment variable is not set");
    }

    await mongoose.connect(dbUrl);
    logger.info("Connected to MongoDB");

    const db = mongoose.connection;
    db.on('error', (err) => {
        logger.error(`Mongoose connection error: ${err}`);
    });
}
