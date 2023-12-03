import {loggers} from "./appLogger";

let logger:any;
if (process.env.MODE === "TEST" ) {
    logger = loggers;
} else {
    logger = loggers;
}
export default logger;