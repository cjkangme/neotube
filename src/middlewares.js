import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "ForYoutube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.loggedInUser || {};
  console.log(res.locals.loggedInUser);
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};

export const passwordOnlyMiddlware = (req, res, next) => {
  if (!req.session.loggedInUser.socialId) {
    next();
  } else {
    return res.redirect("back");
  }
};

export const uploadFileMiddleware = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000,
  },
});
export const uploadVideoMiddleware = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 20000000,
  },
});
