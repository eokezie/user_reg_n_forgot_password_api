import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: {
            type: String,
            required: true,
        },
        password: { type: String },
        phone: { type: String },
        type: { type: String },
        brokerCode: { type: String }
    },
    {
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;