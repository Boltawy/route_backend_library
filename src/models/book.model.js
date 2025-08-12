import mongoose, { model, Schema } from "mongoose";

const bookSchema = new Schema({
    title: { type: String, required: true, maxLength: 40 },
    description: { type: String, maxLength: 200 },
    author: { type: String, maxLength: 200 },
    availableCopies: { type: Number, min: 0, default: 1 },
    publishedYear: { type: Number, min: 0, max: 2025 },
}, { timestamps: true })

const bookModel = mongoose.models.Book || model("Book", bookSchema)
export default bookModel
