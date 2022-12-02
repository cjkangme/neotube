import { showingModal } from "./createModal.js";
import addFlashMessage from "./components/addFlashMessage.js";

const groupTitle = document.querySelector(".group__group-name");
const editBtn = document.querySelector(".group__edit");
const deleteBtn = document.querySelector(".group__remove");

const groupId = document.querySelector(".group__header").dataset.id;

const handleDelete = async () => {
  const a = document.createElement("a");
  a.href = `/api/groups/${groupId}/delete`;
  document.body.appendChild(a);
  a.click();
};

const handleDeleteBtnClick = () => {
  const title = "그룹 삭제";
  const text = "그룹을 완전히 삭제할까요?";
  const cancle = "취소";
  const confirm = "삭제";

  const ok = showingModal(title, text, cancle, confirm);
  ok.addEventListener("click", handleDelete);
};

deleteBtn.addEventListener("click", handleDeleteBtnClick);
