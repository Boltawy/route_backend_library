import userService from "./user.service.js";
import successHandler from "../../utils/successHandler.js";
import { configDotenv } from "dotenv";
configDotenv({ path: './config/dev.env' })

const userController = {
    register: async (req, res) => {
        const { name, email, password, role } = req.body;
        const loginData = await userService.signUp(name, email, password, role);
        return successHandler(res, { message: "User created successfully", ...loginData })
    },
    login: async (req, res) => {
        const { email: loginEmail, password: loginPassword } = req.body;
        const loginData = await userService.login(loginEmail, loginPassword);
        return successHandler(res, { message: "Login successful", ...loginData })
    },
    getProfile: async (req, res) => {
        const id = req.userId;
        const user = await userService.getProfile(id);
        return successHandler(res, { user })
    }

}

export default userController;



