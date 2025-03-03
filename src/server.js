import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/rootRouter.js";
import usersRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import apiRouter from "./routers/apiRouter.js";
import { localsMiddleware } from "./middlewares.js";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}));

app.use(
    session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DB_URL})
    })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/videos", videoRouter);
app.use("/users", usersRouter);
app.use("/", globalRouter);
app.use("/api", apiRouter);


export default app;
