import express from "express";

import {
  getEditUser,
  postEditUser,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
  userProfile,
} from "../controllers/userController";
import {
  passwordOnlyMiddlware,
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadFileMiddleware,
} from "../middlewares";

const userRouter = express.Router();

const IDEXPRESSION = "([0-9a-f]{24})";

// Edit Profile
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditUser)
  .post(uploadFileMiddleware.single("avatar"), postEditUser);
userRouter
  .route(`/:id${IDEXPRESSION}`)
  .all(protectorMiddleware)
  .get(userProfile);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .all(protectorMiddleware, passwordOnlyMiddlware)
  .get(getChangePassword)
  .post(postChangePassword);

export default userRouter;
