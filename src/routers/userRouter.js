import express from "express";
import { edit, startGithubLogin, finishGithubLogin } from "../controllers/userController.js";
import { see, logout  } from "../controllers/userController.js";

const usersRouter = express.Router();

usersRouter.get("/logout", logout);
usersRouter.get("/edit", edit);
usersRouter.get("/github/start", startGithubLogin);
usersRouter.get("/github/finish", finishGithubLogin);
usersRouter.get(":id", see);

export default usersRouter;