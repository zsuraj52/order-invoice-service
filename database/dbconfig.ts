import mongoose , {ConnectOptions} from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
import logger from '../logger/logger';

const mongoUrl = process.env.MONGODB_URL as string;

mongoose.set('strictQuery', true);
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    }as ConnectOptions)
.then(() => {
    logger.info("Database is connected Successfully!")
})
.catch(() => {
    logger.error("Failed To Connect To Database! Please Try Again");
    throw new Error("Failed To Connect To Database! Please Try Again");
})