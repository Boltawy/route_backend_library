import bookService from "./transaction.service.js";
import successHandler from "../../utils/successHandler.js";
import { configDotenv } from "dotenv";
import { safeFind } from "../../utils/safeMongoose.js";
configDotenv({ path: './config/dev.env' })

const transactionController = {
    createBorrow: async (req, res) => {
        const { bookId, userId } = req.body;
        const transaction = await bookService.createBorrow(bookId, userId);
        return successHandler(res, { transaction });
    },
    returnBook: async (req, res) => {
        const { bookId } = req.body;
        const userId = req.userId
        const returnedBook = await bookService.returnBook(bookId, userId);
        return successHandler(res, { returnedBook });
    },
    getTransactions: async (req, res) => {
        const userId = req.userId
        const transactions = await bookService.getTransactions(userId);
        return successHandler(res, { transactions });
    },
}

export default transactionController;



