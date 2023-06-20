import express from 'express';
import {
    userLogin,
    createUser
} from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/login', userLogin);
userRouter.post('/register', createUser);

export default userRouter;