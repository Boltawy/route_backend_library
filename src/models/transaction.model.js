import mongoose, { model, Schema } from "mongoose";

const transactionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    borrowdate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, required: true, enum: ["borrowed", "returned"] }
}, { timestamps: true })

const transactionModel = mongoose.models.Transaction || model("Transaction", transactionSchema)
export default transactionModel
