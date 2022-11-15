import User from "../models/User";
import Video from "../models/Video";

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
    const video = await Video.findById(id).populate("owner");
    console.log(video);
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
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  } else {
    return res.render("videos/edit", {
      pageTitle: `Editing: ${video.title}`,
      video,
    });
  }
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
  const { file } = req;
  try {
    console.log(req.file);
    await Video.create({
      url: `/${file.path}`,
      title: title,
      description: description,
      uploader: uploader,
      category: category,
      tags: Video.formatTags(tags),
      owner: loggedInUser._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};

export const getDeleteVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
