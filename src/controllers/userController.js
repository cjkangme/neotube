import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};

// ToDo : Error Message를 실시간으로 볼 수 있도록 하기 (새로고침 없이)
export const postJoin = async (req, res) => {
  const pageTitle = "Create Account";
  const { email, password, password2, username, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "패스워드가 일치하지 않습니다.",
    });
  }
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email/username is already taken",
    });
  }
  try {
    await User.create({
      email: email,
      password: password,
      username: username,
      location: location,
      socialId: false,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

// login
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  const user = await User.findOne({ username }); // username: req.body.username, username: username 과 동일
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "The Username does not exist",
    });
  }
  if (user.socialId === true) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage:
        "This Account is social account. Please login with Social login",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.loggedInUser = user;
  res.redirect("/");
};

// Github OAuth
export const startGithubLogin = (req, res) => {
  const baseURL = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const URL = `${baseURL}?${params}`;
  return res.redirect(URL);
};

export const finishGithubLogin = async (req, res) => {
  const baseURL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const URL = `${baseURL}?${params}`;
  const tokenRequest = await (
    await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const APIURL = "https://api.github.com";
    const userData = await (
      await fetch(`${APIURL}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const userEmails = await (
      await fetch(`${APIURL}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const userEmailObj = userEmails.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!userEmailObj) {
      return res.redirect("/login"); // ToDo : notification error (깃허브 계정에 이메일 없음)
    }
    let user = await User.findOne({ email: userEmailObj.email });
    if (!user) {
      user = await User.create({
        email: userEmailObj.email,
        password: "",
        username: userData.login,
        avatarUrl: userData.avatar_url,
        location: userData.location,
        socialId: true,
      });
    }
    req.session.loggedIn = true;
    req.session.loggedInUser = user;
  } else {
    return res.redirect("/login"); // ToDo : notification error (깃허브 인증 실패)
  }
  return res.redirect("/");
};

// edit User
export const getEditUser = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEditUser = async (req, res) => {
  const {
    session: {
      loggedInUser: { _id, avatarUrl },
    },
    body: { username, location },
    file,
  } = req;
  let changed = false;
  if (username !== req.session.loggedInUser.username) {
    changed = true;
  }
  const exist = await User.exists({ username });
  if (exist && changed) {
    return res.status(400).render("users/edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "This Username already taken",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? `/${file.path}` : avatarUrl,
      username,
      location,
    },
    { new: true }
  );
  req.session.loggedInUser = updatedUser;
  return res.redirect("/users/edit");
};

// change password
export const getChangePassword = (req, res) => {
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const { currentPassword, newPassword, newPassword2 } = req.body;
  const user = await User.findById(req.session.loggedInUser._id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "입력한 비밀번호가 틀렸습니다.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "두 비밀번호가 일치하지 않습니다. 정확히 입력해주세요.",
    });
  }
  user.password = newPassword;
  await user.save();
  req.session.loggedInUser.password = user.password;
  // send notification
  return res.redirect("/logout");
};

// logout
export const logout = (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/"); // ToDo 에러메세지
  } else {
    req.session.destroy();
  }
  return res.redirect("/");
};
