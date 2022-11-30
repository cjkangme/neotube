import express from "express";
import { getGroup } from "../controllers/groupController";

const groupRouter = express.Router();

const IDEXPRESSION = "([0-9a-f]{24})";

groupRouter.route(`/:id${IDEXPRESSION}`).get(getGroup);

export default groupRouter;
