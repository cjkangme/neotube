import express from "express";

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
import { homeVideo, searchVideo } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", homeVideo);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/search", searchVideo);

export default rootRouter;
