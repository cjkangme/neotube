import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const homeVideo = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.send("server-error", { error });
  }
};

export const searchVideo = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
    });
  }
  return res.render("search", { pageTitle: "Search Video", videos });
};

// Video Routers
export const watchVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id)
      .populate("owner")
      .populate({
        path: "comments",
        populate: {
          path: "owner",
        },
      });
    if (video) {
      return res.render("videos/watch", {
        pageTitle: video.title,
        video,
      });
    } else {
      return res.render("404", { pageTitle: "Video Not Found" });
    }
  } catch (error) {
    return res.send("server-error", { error });
  }
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const {
    loggedInUser: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  if (String(_id) !== String(video.owner)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `Editing: ${video.title}`,
    video,
  });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { url, title, description, uploader, category, tags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  await Video.findByIdAndUpdate(id, {
    url,
    title,
    description,
    uploader,
    category,
    tags: Video.formatTags(tags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUploadVideo = (req, res) => {
  return res.render("videos/upload", {
    pageTitle: "Upload Video",
  });
};

export const postUploadVideo = async (req, res) => {
  const { loggedInUser } = req.session;
  const { title, description, uploader, category, tags } = req.body;
  const { video, thumb } = req.files;
  try {
    const newVideo = await Video.create({
      url: `/${video[0].path}`,
      thumbUrl: `/${thumb[0].path.replaceAll("\\", "/")}`,
      title: title,
      description: description,
      uploader: uploader,
      category: category,
      tags: Video.formatTags(tags),
      owner: loggedInUser._id,
    });
    const user = await User.findById(loggedInUser._id);
    user.videos.push(newVideo._id);
    user.save();
  } catch (error) {
    console.log(error);
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  req.flash("info", "업로드가 완료되었습니다.");
  return res.redirect("/");
};

export const getDeleteVideo = async (req, res) => {
  const { id } = req.params;
  const { loggedInUser: _id } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  if (_id !== video.owner) {
    return res.tatus(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  req.flash("info", "삭제가 완료되었습니다.");
  return res.redirect("/");
};

// api
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  let comment;
  const {
    session: { loggedInUser },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  try {
    comment = await Comment.create({
      owner: loggedInUser._id,
      text,
      video: id,
    });
    video.comments.push(comment._id);
    video.save();
    const user = await User.findById(loggedInUser._id);
    user.comments.push(comment._id);
    user.save();
  } catch {
    return res.sendStatus(403);
  }
  return res.status(201).json({ id: comment._id });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id)
    .populate("owner")
    .populate("video");
  const owner = comment.owner._id;
  console.log(owner, req.session.loggedInUser._id);
  if (req.session.loggedInUser._id !== String(owner)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).json({ videoId: String(comment.video._id) });
  }
  try {
    await Comment.findByIdAndRemove(id).populate("video");
    req.flash("info", "댓글이 삭제되었습니다.");
    return res.status(200).json({ videoId: String(comment.video._id) });
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 다시 시도해주세요");
    return res.status(403).json({ videoId: String(comment.video._id) });
  }
};
