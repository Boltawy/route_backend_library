import { Router } from 'express'
import bookController from './book.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { bookSchema, updateBookSchema } from '../../middleware/validationSchemas.js';
import { authenticate, authorizeAdmin } from '../../middleware/auth.middleware.js';


const bookRouter = Router();

bookRouter.route('/')
    .get(bookController.getBooks)
    .post(validate(bookSchema), authenticate, authorizeAdmin, bookController.createBook);
bookRouter.route('/:id')
    .put(validate(updateBookSchema), authenticate, authorizeAdmin, bookController.updateBook)
    .delete(authenticate, authorizeAdmin, bookController.deleteBook);


export default bookRouter