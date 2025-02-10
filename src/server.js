import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/rootRouter.js";
import usersRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";


const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}));
app.use("/videos", videoRouter);
app.use("/users", usersRouter);
app.use("/", globalRouter);


export default app;
