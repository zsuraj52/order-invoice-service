import express from "express";;
import { banner } from "./logger/banner";
import logger from "./logger/logger";
import dotenv from 'dotenv';
import router from "./src/routes";
import('./database/dbconfig');
dotenv.config();
const app = express();

app.use(express.json());
app.use(router)

let port = process.env.port || 3000;

app.listen((port), () => {
    banner(logger)
})