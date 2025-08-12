import bookModel from "../../models/book.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeFindOne, safeFind, safeDelete, safeDeleteById, safeUpdateById } from "../../utils/safeMongoose.js";


const bookService = {
    getAllBooks: async () => {
        return await safeFind(bookModel, {})
    },
    createBook: async (book) => {
        return await safeCreate(bookModel, book)
    },
    updateBook: async (bookId, book) => {
        console.log(book)
        return await safeUpdateById(bookModel, bookId, book)
    },
    deleteBook: async (bookId) => {
        return await safeDeleteById(bookModel, bookId, { hardDelete: true })
    },
}

export default bookService



