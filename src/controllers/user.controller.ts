import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import Dummy from "../models/dummy.model";

import getUserEmail from "../services/user.service";
import { randomOTP } from "../utils/randomOtp";
import { generateUToken } from '../utils/generateUserToken'
import { TUserRegRequest, TResquestBody } from "../types/user.types";
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
            throw new Error("All fields are required");
        };

        const user = await getUserEmail(email);

        if ( !user ) {
            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                phone,
                type,
                brokerCode
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
        
        if (
            !user ||
            !bcrypt.compareSync(password, user.password!)
        ) {
            res.status(404).send("Invalid credentials provided");
        }

        if ( user ) {
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
}

export {
    createUser,
    userLogin
}
