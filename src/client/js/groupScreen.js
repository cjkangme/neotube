import { showingModal } from "./createModal.js";
import addFlashMessage from "./components/addFlashMessage.js";

const groupTitle = document.querySelector(".group__group-name");
const editBtn = document.querySelector(".group__edit");
const deleteBtn = document.querySelector(".group__remove");
const parentNode = document.querySelector(".group__header");
const groupId = parentNode.dataset.id;

// delete
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

// edit
const handleInputKeyup = async (event) => {
  if (event.key === "Enter") {
    const { value } = event.target;
    event.preventDefault();
    if (value === "") {
      return;
    }
    const response = await fetch(`/api/groups/${groupId}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        groupId,
      }),
    });
    if (response.status == 200) {
      const input = document.querySelector(".group__group-name--edit");
      const title = document.createElement("div");
      const navGroup = document.querySelector(`.id-${groupId}`);

      title.className = "group__group-name";
      title.innerText = value;
      parentNode.insertBefore(title, input);
      input.remove();

      navGroup.innerText = value;

      addFlashMessage("info", "그룹 이름이 변경되었습니다.");
    } else if (response.status == 403) {
      addFlashMessage("error", "권한이 없습니다.");
    } else if (response.status == 404) {
      addFlashMessage(
        "error",
        "삭제할 그룹을 찾지 못했습니다. 이미 삭제되었거나 잘못된 주소를 입력하셨습니다."
      );
    }
  }
};

const handleEditBtnClick = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = "10";
  input.className = "group__group-name group__group-name--edit";
  input.value = groupTitle.innerText;
  input.addEventListener("keyup", handleInputKeyup);

  parentNode.insertBefore(input, groupTitle);
  groupTitle.remove();
  input.focus();
};

deleteBtn.addEventListener("click", handleDeleteBtnClick);
editBtn.addEventListener("click", handleEditBtnClick);
