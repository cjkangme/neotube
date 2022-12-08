import User from "../models/User";
import Video from "../models/Video";
import Group from "../models/Group";
import Comment from "../models/Comment";
import fetch from "node-fetch";

// Root Routers
export const homeVideo = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");

    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    return res.send("server-error", { error });
  }
};

export const searchVideo = async (req, res) => {
  const { search } = req.query;
  let videos = [];
  if (search) {
    videos = await Video.find({
      title: { $regex: new RegExp(search, "i") },
    });
  }
  return res.render("search", { pageTitle: "Search Video", videos });
};

export const settingVideo = (req, res) => {
  return res.render("setting", { pageTitle: "Settings" });
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
  try {
    const { loggedInUser } = req.session;
    const { title, description, tags } = req.body;
    const { video, thumb } = req.files;
    const isHeroku = process.env.NODE_ENV === "production";
    const newVideo = await Video.create({
      url: isHeroku ? video[0].location : `/${video[0].path}`,
      thumbUrl: isHeroku
        ? thumb[0].location
        : `/${thumb[0].path.replaceAll("\\", "/")}`,
      title: title,
      description: description,
      uploader: req.session.loggedInUser.username,
      youtubeVideo: false,
      tags: Video.formatTags(tags),
      owner: loggedInUser._id,
    });
    const user = await User.findById(loggedInUser._id);
    user.videos.push(newVideo._id);
    user.save();
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 다시 시도해주세요");
    return res.status(400).redirect("upload");
  }
  req.flash("info", "업로드가 완료되었습니다.");
  return res.redirect("/");
};

export const getDeleteVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.loggedInUser;
  console.log(_id);
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  if (String(_id) !== String(video.owner)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
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

// Youtube API
const youtubeBaseURL = "https://www.googleapis.com/youtube/v3";

export const getUploadYoutube = (req, res) => {
  return res.render("videos/upload-youtube", { pageTitle: "Upload Youtube" });
};

export const postUploadYoutube = async (req, res) => {
  // 유저가 입력한 주소로부터 id 구하기
  const { videoUrl } = req.body;
  let { title, description, tags } = req.body;
  let id;
  if (videoUrl.match(/(youtu\.be)/g)) {
    id = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
  } else {
    const queryString = videoUrl.substring(videoUrl.indexOf("?"));
    const params = new URLSearchParams(queryString);
    id = params.get("v");
  }
  if (!id) {
    req.flash("error", "영상을 찾지 못했습니다. 정확한 주소를 입력해주세요");
    return res.status(400).redirect("upload-youtube");
  }
  // ToDo : 유튜브로부터 영상 정보 가져오기

  const config = {
    key: process.env.YOUTUBE_API,
    part: "snippet",
    id,
  };
  const reqParams = new URLSearchParams(config).toString();
  const URL = `${youtubeBaseURL}/videos?${reqParams}`;
  const video = await (
    await fetch(URL, {
      method: "GET",
    })
  ).json();

  // 가져온 정보 바탕으로 video 생성
  try {
    if (!title) {
      title = video.items[0].snippet.title;
    }
    if (!description) {
      description = video.items[0].snippet.description;
    }
    console.log(video.items[0].snippet);
    const createdVideo = await Video.create({
      url: id,
      thumbUrl: video.items[0].snippet.thumbnails.high.url,
      title,
      description,
      uploader: req.session.loggedInUser.username,
      youtubeVideo: true,
      owner: req.session.loggedInUser._id,
      tags: Video.formatTags(tags),
    });
    const user = await User.findById(req.session.loggedInUser._id);
    user.videos.push(createdVideo._id);
    await user.save();
    req.session.loggedInUser = user;
    req.flash("info", "성공적으로 업로드 되었습니다.");
    return res.status(200).redirect(`${createdVideo._id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "알 수 없는 오류가 발생했습니다.");
    return res.status(400).redirect("upload-youtube");
  }
};
