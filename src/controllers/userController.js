import express from "express";

const app = express();

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};

export const postJoin = (req, res) => {
  console.log(req.body);
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
