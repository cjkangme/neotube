import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
  owner: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
  text: { type: String, required: true, maxLength: 300 },
  video: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
