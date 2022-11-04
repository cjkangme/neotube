import Video from "../models/Video";

export const homeVideo = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.send("server-error", { error });
  }
};

// Video Routers
export const watchVideo = (req, res) => {
  const { id } = req.params; //const id = req.params.id;
  return res.render("watch", {
    pageTitle: `Watching`,
  });
};

export const getEditVideo = (req, res) => {
  const id = req.params.id;
  return res.render("edit", {
    pageTitle: `Editing:`,
  });
};

export const postEditVideo = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUploadVideo = (req, res) => {
  return res.render("upload", {
    pageTitle: "Upload Video",
  });
};

export const postUploadVideo = async (req, res) => {
  const { url, title, description, uploader, category, tags } = req.body;
  try {
    await Video.create({
      url: url,
      title: title,
      description: description,
      uploader: uploader,
      category: category,
      tags: tags
        .replace(/ /g, "")
        .split(",")
        .map((word) => `#${word}`),
    });
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};
