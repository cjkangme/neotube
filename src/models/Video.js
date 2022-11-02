import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema({
  url: String,
  title: String,
  description: String,
  uploader: String,
  createdAt: Date,
  categories: String,
  tags: [{ type: String }],
  meta: {
    views: Number,
    subscribers: Number,
    likes: Number,
    Dislikes: Number,
  },
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
