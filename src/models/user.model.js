import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 25, trim: true, unique: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, minLength: 8 },
    role: { type: String, required: true, enum: ['admin', 'member'] }
}, { timestamps: true })

const userModel = mongoose.models.User || model("User", userSchema)
export default userModel