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
    user.save();
    req.flash("info", "그룹이 생성되었습니다.");
    return res.status(200).redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "오류가 발생했습니다. 다시 시도해주세요");
    return res.status(403).redirect("/");
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
