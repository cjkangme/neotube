import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};

export const postJoin = async (req, res) => {
  const { email, password, username, location } = req.body;
  try {
    await User.create({
      email: email,
      password: password,
      username: username,
      location: location,
    });
  } catch (error) {
    console.log(error);
    return res.render("join", {
      pageTitle: "Error",
      errorMessage: error._message,
    });
  }
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
