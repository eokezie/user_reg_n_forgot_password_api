import User from "../models/user.model";
import Dummy from "../models/dummy.model";
import { v4 as uuidv4 } from 'uuid';
import { Types } from "mongoose";

import { TDummyUser } from "../types/user.types";

const getUserEmail = async (email: string) => {
    const query = User.where({ email: email });
	return await query.findOne();
}

const getDummyUser = async ({
    email,
    otp,
    expired
}: TDummyUser) => {
    const dummy = await Dummy.create({
        email,
        otp,
        expired,
        token: uuidv4()
    });
    return dummy;
}

const findUserandUpdate = async (id: Types.ObjectId, hashedPassword: string) => {
    const update = await User.findByIdAndUpdate( 
        id, 
        {
            password: hashedPassword
        },
        { new: true, useFindAndModify: false }
    )

    return update;
};

const getUserToken = async (token: string) => {
    const query = Dummy.where({ token });
	return await query.findOne();
};

const deleteDummyUser = async (token: Types.ObjectId) => {
    const query = Dummy.where({ token });
	return await query.deleteOne();
}


export {
    getUserEmail,
    getDummyUser,
    findUserandUpdate,
    getUserToken,
    deleteDummyUser
};
