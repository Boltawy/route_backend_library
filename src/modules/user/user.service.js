import userModel from "../../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeFindOne } from "../../utils/safeMongoose.js";


const localUtils = {
    signJWT: (_id, userName, role) => {
        const tokenPayload = {
            _id, userName, role
        }

        const accessToken = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SECRET,
            { expiresIn: Boolean(process.env.DEV) ? "365d" : "1h" }
        )
        const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET,
            { expiresIn: "365d" }
        )
        return { accessToken, refreshToken }
    }
}


const userService = {
    signUp: async (name, email, password, role) => {
        const user = await safeFindOne(userModel, { email }, { errOnNotFound: false })
        if (user) throw new responseError(409, "A user already exists with given email")
        const hashedPassword = await bcrypt.hash(password, 8)
        await safeCreate(userModel, { name, email, password: hashedPassword, role });
        const newUser = await safeFindOne(userModel, { email })
        return { _id: newUser._id, name };
    },

    login: async (loginEmail, loginPassword) => {
        const user = await safeFindOne(userModel, { email: loginEmail },); //Invalid Email, Or other server errors.
        const { _id, name, password, role } = user
        const isValidPassword = await bcrypt.compare(loginPassword, password)
        if (!isValidPassword) {
            throw new responseError(404, "Invalid credentials") //Invalid Password
        }

        const { accessToken, refreshToken } = localUtils.signJWT(_id, name, role);
        return { _id, name, role, accessToken, refreshToken };
    },
    getProfile: async (id) => {
        const user = await safeFindOne(userModel, { _id: id });
        return user;
    }
}
export default userService
