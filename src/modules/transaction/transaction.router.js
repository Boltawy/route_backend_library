import { Router } from 'express'
import transactionController from './transaction.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { borrowSchema, returnSchema } from '../../middleware/validationSchemas.js';
import { authenticate, authorizeAdminOrOwner } from '../../middleware/auth.middleware.js';


const transactionRouter = Router();

transactionRouter.route('/borrow')
    .post(validate(borrowSchema), authenticate, transactionController.createBorrow);
transactionRouter.route('/return')
    .put(validate(returnSchema), authenticate, authorizeAdminOrOwner, transactionController.returnBook)

transactionRouter.route('/user')
    .get(authenticate, transactionController.getTransactions)


export default transactionRouter