import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: { type: "String", unique: true, required: true },
  owner: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
  videos: [
    { type: mongoose.SchemaTypes.ObjectId, requried: true, ref: "Video" },
  ],
});

const groupModel = mongoose.model("Group", groupSchema);

export default groupModel;
