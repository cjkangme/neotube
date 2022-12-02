import mongoose from "mongoose";
import Group from "../models/Group";
import User from "../models/User";

// createGroup
export const createGroup = async (req, res) => {
  const { groupName } = req.body;
  const userId = req.session.loggedInUser._id;
  const exists = await Group.exists({ groupName: groupName });
  if (exists) {
    req.flash(
      "error",
      "이미 존재하는 그룹 이름입니다. 다른 이름을 입력해주세요."
    );
    return res.status(403).redirect("/");
  }
  try {
    const user = await User.findById(userId);
    const newGroup = await Group.create({
      groupName,
      owner: req.session.loggedInUser._id,
    });
    user.groups.push(newGroup._id);
    await user.save();
    const newUser = await User.findById(userId).populate("groups");
    req.session.loggedInUser = newUser;
    req.flash("info", "그룹이 생성되었습니다.");
    return res.status(200).redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 다시 시도해주세요");
    return res.status(403).redirect("/");
  }
};

// delete group
export const deleteGroup = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.loggedInUser._id;
  const group = await Group.findById(id);
  if (String(userId) !== String(group.owner)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(401).redirect(`/`);
  }
  try {
    const user = await User.findById(userId).populate("groups");
    user.groups.pull({ _id: mongoose.Types.ObjectId(id) });
    await user.save();
    req.session.loggedInUser = user;
    await Group.findByIdAndDelete(id);
    req.flash("info", "그룹이 삭제되었습니다.");
    return res.status(200).redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 다시 시도해주세요.");
    return res.status(403).redirect("/");
  }
};

// edit groupName
export const editGroup = async (req, res) => {
  const { value, groupId } = req.body;
  const userId = req.session.loggedInUser._id;
  const group = await Group.findById(groupId);
  if (!group) {
    return res.sendStatus(404);
  }
  if (userId !== String(group.owner)) {
    return res.sendStatus(403);
  }
  const newGroup = await Group.findByIdAndUpdate(groupId, { groupName: value });
  const newUser = await User.findById(userId).populate("groups");
  req.session.loggedInUser = newUser;
  return res.sendStatus(200);
};

// scan if video already exists in groups
export const scanVideo = async (req, res) => {
  const { groupId, videoId } = req.body;
  const group = await Group.findById(groupId);
  const exists = group.videos.map(String).includes(videoId);
  return res.status(200).json({ exists });
};

// add video to group
export const addVideo = async (req, res) => {
  const { groupId, videoId } = req.body;
  try {
    const group = await Group.findById(groupId);
    const exists = group.videos.map(String).includes(videoId);
    if (exists) {
      return res.sendStatus(200);
    }
    group.videos.push(videoId);
    await group.save();
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 새로고침 후 다시 시도해주세요");
    return res.status(403).redirect(`/videos/${videoId}`);
  }
};

// delete video from group
export const deleteVideo = async (req, res) => {
  const { groupId, videoId } = req.body;
  try {
    const group = await Group.findById(groupId).populate("videos");
    group.videos.pull({ _id: mongoose.Types.ObjectId(videoId) });
    await group.save();
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 새로고침 후 다시 시도해주세요");
    return res.status(403).redirect(`/videos/${videoId}`);
  }
};

// show group video list
export const getGroup = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findById(id).populate("videos");
    return res.render("group", {
      pageTitle: `그룹:${group.groupName}`,
      group,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 다시 시도해주세요");
    return res.status(403).redirect("/");
  }
};
