import express from "express";

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from "../controllers/userController";
import { homeVideo, searchVideo } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", homeVideo);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/search", searchVideo);
rootRouter.get("/logout", logout);

export default rootRouter;
