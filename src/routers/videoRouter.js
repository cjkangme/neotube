import express from 'express';

import {
  watchVideo,
  getEditVideo,
  postEditVideo,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/:id(\\d+)', watchVideo);
videoRouter.route('/:id(\\d+)/edit').get(getEditVideo).post(postEditVideo);

export default videoRouter;
