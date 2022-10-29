import express from 'express';

const app = express();

export const join = (req, res) => {
  res.send('Join');
};

export const login = (req, res) => {
  res.send('Login');
};

export const seeUsers = (req, res) => {
  res.send('See User');
};

export const editUser = (req, res) => {
  res.send('Edit User');
};

export const deleteUser = (req, res) => {
  res.send('Delete User');
};

export const logout = (req, res) => {
  res.send('Log Out');
};
