import { Types } from "mongoose";

export type TUserRegRequest = {
    _id: Types.ObjectId,
    name: string,
    email: string,
    password: string,
    phone: string,
    type: string,
    brokerCode: string,
    application: string
};

export type TResquestBody = {
	email: string;
	password: string;
};

export type TDummyUser = {
    email: string,
    otp: number,
    expired: Date,
    token?: string
}

export type TUserReest = {
    otp: string, 
    password: string, 
    confirmPassword: string, 
    user_id: Types.ObjectId, 
    token: string
}