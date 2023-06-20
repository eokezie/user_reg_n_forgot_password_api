import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import moment from 'moment';
import User from "../models/user.model";

import { getUserEmail,
    getDummyUser,
    findUserandUpdate,
    getUserToken,
    deleteDummyUser,
    createNewUser
 } from "../services/user.service";
import { randomOTP } from "../utils/randomOtp";
import { generateUToken } from '../utils/generateUserToken'
import { TUserRegRequest, TResquestBody, TUserReest } from "../types/user.types";
import { successResponse } from "../utils/successResponse";

/**
 * @route POST /api/users/register
 * @method POST
 */
const createUser = async (req: Request, res: Response) => {
    const {
        name,
        email,
        password,
        phone,
        type,
        brokerCode,
        application
    }: TUserRegRequest = req.body;

    try {
        if (!application || !email || !password || !name || !phone || !brokerCode || !type) {
            res.status(404).send("All fields are required");
            return;
        };

        const user = await getUserEmail(email);

        if ( !user ) {
            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await createNewUser({
                name,
                email,
                brokerCode,
                type,
                phone,
                password: hashedPassword,
                application
            });

            /**
             * Logger function being saved to the DB
             * Function to send email to users after account creations
             */

            return res.status(201).json({
                message: "User created successfully",
                data: newUser
            });
        } else {
            return res.status(400).json({
                message: "You have an account with us."
            })
        }
        
    } catch (error) {
        
    }
};

/**
 * @route POST /api/users/login
 * @method POST
 */
const userLogin = async (req: Request, res: Response) => {
    const { email, password }: TResquestBody = req.body;

    try {
        if (!email || !password) {
            throw new Error("Please provide correct credentials");
        }

        const user = await getUserEmail(email);

        if ( user ) {

            if (
                !bcrypt.compareSync(password, user.password!)
            ) {
                res.status(404).send("Invalid credentials provided");
                return;
            }

            const responseBody = {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                brokerCode: user?.brokerCode,
                type: user?.type,
                __v: user?.__v,
                created_at: user?.createdAt,
                updated_at: user?.updatedAt,
                token: generateUToken(user?._id),
            };
            const responseMessage = 'User authenticated successfully'

            res.status(201)
                .json(successResponse(
                    responseBody,
                    responseMessage
                ))
        } else {
            res.status(404).send("User not found");
        };

    }catch (error) {
        res.status(404).send('Something went wrong')
    }
};

/**
 * @route POST /api/users/forgot-password
 * @method POST
 */
const forgotPassword = async (req: Request, res: Response) => {
    const { email }: TResquestBody = req.body;

    try {
        if (!email) {
            res.status(404).send("Please provide correct credentials");
            return;
        }

        const user = await getUserEmail(email.toLowerCase());

        if ( user ) {
            const otp = randomOTP(6);
            const expiryDate = moment(new Date()).add(30, "m").toDate();

            const dummy = await getDummyUser({
                email,
                otp,
                expired: expiryDate
            });

            if ( dummy ) {
                /** 
                 * A function to send email to user after OTP is sent and log users action to DB
                */
               console.log('User token ====', dummy.token)
               console.log('User OTP ====', dummy.otp)

               return;
            }
            const responseMessage = 'OTP sent to your email'

            res.status(201)
                .send(responseMessage)
        } else {
            res.status(404).send("User not found");
        };

    }catch (error) {
        res.status(404).send('Something went wrong')
    }

};

/**
 * @route POST /api/users/reset-password
 * @method POST
 */
const resetUserPassword = async (req: Request, res: Response) => {
    const { otp, password, confirmPassword, user_id, token }: TUserReest = req.body;

    try {
        const getToken = await getUserToken(token); //Confirm a Users Token

        if ( !getToken ) {
            res.status(404).send('Invalid OTP Request. Please try requesting again.')
            return;
        }

        if ( otp !== getToken?.otp ) {
            res.status(404).send('Invalid OTP.');
            return;
        }

        if ( password !== confirmPassword ) {
            res.status(404).send("Passwords does not match");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const update = await findUserandUpdate(user_id, hashedPassword); //Update Users Id

        if ( update && getToken ) {
            await deleteDummyUser(getToken._id)

            res.status(201).json({
                message: "Password updated successfully",
                success: true
            })
        } else {
            res.status(201).send('Error updating password')
        }
    } catch (error) {
        res.status(201).send('Something went wrong')
    }
}

export {
    createUser,
    userLogin,
    forgotPassword,
    resetUserPassword
}
