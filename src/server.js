import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter.js";
import usersRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

console.log(process.cwd());

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use("/videos", videoRouter);
app.use("/users", usersRouter);
app.use("/", globalRouter);



const handleListening = () => console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);