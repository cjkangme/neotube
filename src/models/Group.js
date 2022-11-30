import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true, unique: true },
  owner: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
  level: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, required: true, default: Date.now },
  videos: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Video" }],
});

const groupModel = mongoose.model("Group", groupSchema);

export default groupModel;
