import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/rootRouter.js";
import usersRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middlewares.js";


const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}));

app.use(
    session({
    secret: "Hello",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: "mongodb://127.0.0.1:27017/wetube"})
    })
);

app.use(localsMiddleware);
app.use("/videos", videoRouter);
app.use("/users", usersRouter);
app.use("/", globalRouter);


export default app;
