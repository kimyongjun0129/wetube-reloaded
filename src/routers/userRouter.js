import express from "express";
import { getEdit, postEdit, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword } from "../controllers/userController.js";
import { see, logout  } from "../controllers/userController.js";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares.js"

const usersRouter = express.Router();

usersRouter.get("/logout", protectorMiddleware, logout);
usersRouter.route("/edit")
.all(protectorMiddleware)
.get(getEdit)
.post(avatarUpload.single("avatar"), postEdit)
usersRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
usersRouter.get("/:id(\\d+)", see);
usersRouter.route("/change-password").get(getChangePassword).post(postChangePassword);

export default usersRouter;