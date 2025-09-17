import mongoose from 'mongoose';
import env from '../constants/env';


const MONGO_URL = env.db_url


if (!MONGO_URL) {
    throw new Error("Database url is not provided")
}


const connect_to_db = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log("Database already connected");
        return;
    }

    console.log("connecting to Database.........")
    try {
        await mongoose.connect(MONGO_URL)
    }
    catch (err) {
        return console.log("error in connecting to Database", err)
    }
    console.log("connected to Database successfully")
}



export { connect_to_db };