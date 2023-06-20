import mongoose from "mongoose";

const dummySchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		otp: { type: String, required: true },
		expired: { type: Date },
		token: { type: String },
	},
	{
		timestamps: true,
	}
);

const Dummy = mongoose.model("Dummy", dummySchema);

export default Dummy;
