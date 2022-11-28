import express from "express";
import axios from "axios";

import {
  watchVideo,
  getEditVideo,
  postEditVideo,
  getUploadVideo,
  postUploadVideo,
  getDeleteVideo,
  postUploadYoutube,
  getUploadYoutube,
} from "../controllers/videoController";
import {
  crossOriginMiddleware,
  protectorMiddleware,
  uploadVideoMiddleware,
} from "../middlewares";

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
  .all(protectorMiddleware, crossOriginMiddleware)
  .get(getUploadVideo)
  .post(
    uploadVideoMiddleware.fields([
      { name: "video", maxcount: 1 },
      { name: "thumb", maxcount: 1 },
    ]),
    postUploadVideo
  );
videoRouter
  .route("/upload-youtube")
  .all(protectorMiddleware)
  .get(getUploadYoutube)
  .post(postUploadYoutube);
videoRouter.get(
  `/:id${IDEXPRESSION}/delete`,
  protectorMiddleware,
  getDeleteVideo
);

export default videoRouter;
