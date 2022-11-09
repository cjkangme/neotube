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
    });
    return res.redirect("/login");
  } catch {
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
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

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
    const userRequest = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    console.log(userRequest);
  } else {
    return res.redirect("/login");
  }
  return res.end();
};

export const seeUsers = (req, res) => {
  res.send("See User");
};

export const editUser = (req, res) => {
  res.send("Edit User");
};

export const deleteUser = (req, res) => {
  res.send("Delete User");
};

export const logout = (req, res) => {
  res.send("Log Out");
};
