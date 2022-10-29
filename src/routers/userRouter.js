import express from 'express';

import {
  seeUsers,
  editUser,
  deleteUser,
  logout,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/:id', seeUsers);
userRouter.get('/edit', editUser);
userRouter.get('/delete', deleteUser);
userRouter.get('/logout', logout);

export default userRouter;
