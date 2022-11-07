import express from "express";

import { getJoin, postJoin, login } from "../controllers/userController";
import { homeVideo, searchVideo } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", homeVideo);
rootRouter.get("/login", login);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/search", searchVideo);

export default rootRouter;
