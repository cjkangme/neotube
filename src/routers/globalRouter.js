import express from 'express';

import { join, login } from '../controllers/userController';
import { homeVideo, search } from '../controllers/videoController';

const globalRouter = express.Router();

globalRouter.get('/', homeVideo);
globalRouter.get('/login', login);
globalRouter.get('/join', join);
globalRouter.get('/search', search);

export default globalRouter;
