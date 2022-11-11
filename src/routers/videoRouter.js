import express from "express";

import {
  watchVideo,
  getEditVideo,
  postEditVideo,
  getUploadVideo,
  postUploadVideo,
  getDeleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();
const IDEXPRESSION = "([0-9a-f]{24})";

videoRouter.get(`/:id${IDEXPRESSION}`, watchVideo);
videoRouter
  .route(`/:id${IDEXPRESSION}/edit`)
  .all(protectorMiddleware)
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUploadVideo)
  .post(postUploadVideo);
videoRouter.get(
  `/:id${IDEXPRESSION}/delete`,
  protectorMiddleware,
  getDeleteVideo
);

export default videoRouter;
