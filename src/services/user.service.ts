import User from "../models/user.model";

const getUserEmail = async (email: string) => {
    const query = User.where({ email: email });
	return await query.findOne();
}

export default getUserEmail;
