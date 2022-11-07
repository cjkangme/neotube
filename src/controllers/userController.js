import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};

export const postJoin = async (req, res) => {
  const pageTitle = "Create Account";
  const { email, password, password2, username, location } = req.body;
  if (password !== password2) {
    return res.render("join", {
      pageTitle,
      errorMessage: "패스워드가 일치하지 않습니다.",
    });
  }
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This email/username is already taken",
    });
  }
  await User.create({
    email: email,
    password: password,
    username: username,
    location: location,
  });
  return res.redirect("/login");
};

export const login = (req, res) => {
  res.send("Login");
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
