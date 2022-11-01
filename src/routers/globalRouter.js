import express from 'express';

import { join, login } from '../controllers/userController';
import { homeVideo } from '../controllers/videoController';

const globalRouter = express.Router();

globalRouter.get('/', homeVideo);
globalRouter.get('/login', login);
globalRouter.get('/join', join);

export default globalRouter;
