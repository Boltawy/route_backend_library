import { Router } from 'express'
import userController from './user.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { signupSchema, loginSchema } from '../../middleware/validationSchemas.js';
import { authenticate } from '../../middleware/auth.middleware.js';


const userRouter = Router();

userRouter.route('/register').post(validate(signupSchema), userController.register);
userRouter.route('/login').post(validate(loginSchema), userController.login);
userRouter.route('/profile').get(authenticate, userController.getProfile);


export default userRouter