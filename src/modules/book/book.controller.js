import bookService from "./book.service.js";
import successHandler from "../../utils/successHandler.js";
import { configDotenv } from "dotenv";
import { safeFind } from "../../utils/safeMongoose.js";
configDotenv({ path: './config/dev.env' })

const bookController = {
    getBooks: async (req, res, next) => {
        const books = await bookService.getAllBooks()
        successHandler(res, { books })
    },

    createBook: async (req, res, next) => {
        const book = req.body;
        const createdBook = await bookService.createBook(book)
        successHandler(res, { createdBook })
    },

    updateBook: async (req, res, next) => {
        const bookId = req.params.id;
        const book = req.body;
        const updatedBook = await bookService.updateBook(bookId, book)
        successHandler(res, { updatedBook })
    },

    deleteBook: async (req, res, next) => {
        const bookId = req.params.id;
        const deletedBook = await bookService.deleteBook(bookId)
        successHandler(res, { deletedBook })
    },

}

export default bookController;



