import express from "express";

import {
  seeUsers,
  editUser,
  deleteUser,
  logout,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", seeUsers);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/logout", logout);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
