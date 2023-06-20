import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import Dummy from "../models/dummy.model";

import getUserEmail from "../services/user.service";
import { randomOTP } from "../utils/randomOtp";
import { TUserRegRequest } from "../types/user.types";

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

            // const payload = { id: newUser._id };
            // const options = { subject: email, audience: application };
            // const signedToken = 

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
}