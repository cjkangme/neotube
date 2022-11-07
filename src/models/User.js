import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  location: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
});

userSchema.pre("save", async function (hash) {
  console.log(this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log(this.password);
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
