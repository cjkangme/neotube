import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, reqiored: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  location: { type: String },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
