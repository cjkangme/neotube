import express from "express";
import { registerView } from "../controllers/videoController";

const apiRouter = express.Router();

const IDEXPRESSION = "([0-9a-f]{24})";

apiRouter.post(`/videos/:id${IDEXPRESSION}/view`, registerView);

export default apiRouter;
