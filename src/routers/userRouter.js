import express from "express";
import { remove, edit } from "../controllers/userController.js";
import { see, logout } from "../controllers/userController.js";

const usersRouter = express.Router();

usersRouter.get("/logout", logout);
usersRouter.get("/edit", edit);
usersRouter.get("/remove", remove);
usersRouter.get(":id", see);

export default usersRouter;