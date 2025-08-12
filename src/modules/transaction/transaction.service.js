import transactionModel from "../../models/transaction.model.js";
import bookModel from "../../models/book.model.js";
import { responseError } from "../../utils/errorHandler.js";
import { safeCreate, safeFindOne, safeFind, safeUpdateById } from "../../utils/safeMongoose.js";


const transactionService = {
    createBorrow: async (bookId, userId) => {
        const book = await safeFindOne(bookModel, { _id: bookId })
        if (book.availableCopies <= 0) throw new responseError(404, "Book not available")
        await safeUpdateById(bookModel, bookId, { availableCopies: book.availableCopies - 1 })
        return await safeCreate(transactionModel, { bookId, userId, status: "borrowed" })
    },
    returnBook: async (bookId, userId) => {
        let transaction = await safeFindOne(transactionModel, { bookId, userId, status: "borrowed" }, { errOnNotFound: false })
        if (!transaction) {
            const transaction = await safeFindOne(transactionModel, { bookId, userId, status: "returned" }, { errOnNotFound: false })
            if (transaction) throw new responseError(400, "Book already returned")
            else throw new responseError(404, "Transaction not found")
        }
        const book = await safeFindOne(bookModel, { _id: bookId })
        await safeUpdateById(bookModel, bookId, { availableCopies: ++book.availableCopies })
        return await safeUpdateById(transactionModel, transaction._id, { status: "returned" })
    },
    getTransactions: async (userId) => {
        const transactions = await safeFind(transactionModel, { userId }, { lean: true })
        const transactionIds = transactions.map(transaction => transaction.bookId)
        const books = await safeFind(bookModel, { _id: { $in: transactionIds } }, { lean: true })
        return transactions.map((transaction) => {
            const book = books.find(book => book._id.equals(transaction.bookId))
            return { ...transaction, book }
        })
    },
}

export default transactionService



