import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  owner: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
  level: { type: Number, required: true, default: 1 },
  videos: [
    { type: mongoose.SchemaTypes.ObjectId, requried: true, ref: "Video" },
  ],
});

const groupModel = mongoose.model("Group", groupSchema);

export default groupModel;
