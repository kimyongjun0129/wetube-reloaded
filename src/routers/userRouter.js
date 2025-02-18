import express from "express";
import { getEdit, postEdit, startGithubLogin, finishGithubLogin } from "../controllers/userController.js";
import { see, logout  } from "../controllers/userController.js";
import { protectorMiddleware, publicOnlyMiddleware, uploadFiles } from "../middlewares.js"

const usersRouter = express.Router();

usersRouter.get("/logout", protectorMiddleware, logout);
usersRouter.route("/edit")
.all(protectorMiddleware)
.get(getEdit)
.post(uploadFiles.single("avatar"), postEdit)
usersRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
usersRouter.get(":id", see);

export default usersRouter;