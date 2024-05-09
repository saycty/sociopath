import { Mongoose, Schema } from "mongoose";


const passwordResetSchema = Schema({
  userId: { type: String, Unique: true },
  userId: { type: String, Unique: true },
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const PasswordReset = Mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;
