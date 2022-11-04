import express from "express";

import {
  watchVideo,
  getEditVideo,
  postEditVideo,
  getUploadVideo,
  postUploadVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();
const IDEXPRESSION = "([0-9a-f]{24})";

videoRouter.get(`/:id${IDEXPRESSION}`, watchVideo);
videoRouter
  .route(`/:id${IDEXPRESSION}/edit`)
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo);

export default videoRouter;
