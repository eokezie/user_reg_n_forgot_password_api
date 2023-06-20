import express from 'express';
import {
    userLogin,
    createUser,
    forgotPassword,
    resetUserPassword
} from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/login', userLogin);
userRouter.post('/register', createUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetUserPassword);

export default userRouter;