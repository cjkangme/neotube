import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  location: { type: String },
  socialId: { type: Boolean, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  videos: [
    { type: mongoose.SchemaTypes.ObjectId, requried: true, ref: "Video" },
  ],
  groups: [
    { type: mongoose.SchemaTypes.ObjectId, requried: true, ref: "Group" },
  ],
  comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Comment" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
