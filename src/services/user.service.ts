import User from "../models/user.model";

const getUserEmail = async (email: string) => {
    const user = await User.where({ email: email });
    return user;
}

export default getUserEmail;
