import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGO DB CONNECTED!!  ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MONGO DB ERR:", error);
        throw error
    }
}

export default connectDb;