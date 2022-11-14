import express from "express";

import {
  seeUsers,
  getEditUser,
  postEditUser,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  passwordOnlyMiddlware,
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadFileMiddleware,
} from "../middlewares";

const userRouter = express.Router();

// Edit Profile
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditUser)
  .post(uploadFileMiddleware.single("avatar"), postEditUser);

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .all(protectorMiddleware, passwordOnlyMiddlware)
  .get(getChangePassword)
  .post(postChangePassword);

export default userRouter;
