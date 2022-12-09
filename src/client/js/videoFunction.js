import { showingModal } from "./createModal.js";
import addFlashMessage from "./components/addFlashMessage.js";

// description 더보기 기능
const moreBtn = document.querySelector(".video__description-more");
const description = document.querySelector(".video__description");

const handleBrief = () => {
  description.style.height = "100px";
  moreBtn.innerText = "더보기";
  moreBtn.removeEventListener("click", handleBrief);
  moreBtn.addEventListener("click", handleMore);
};

const handleMore = () => {
  description.style.height = "fit-content";
  moreBtn.innerText = "간략히";
  moreBtn.removeEventListener("click", handleMore);
  moreBtn.addEventListener("click", handleBrief);
};

if (description.scrollHeight > description.clientHeight) {
  moreBtn.addEventListener("click", handleMore);
} else {
  moreBtn.classList.add("hidden");
}

// 동영상 삭제 버튼 작동
const deleteBtn = document.querySelector(".video__delete-btn");
let videoId;

const handleRemoveVideo = () => {
  const a = document.createElement("a");
  a.href = `/videos/${videoId}/delete`;

  document.body.appendChild(a);
  a.click();
};

const handleDelete = (event) => {
  const { id } = event.target.dataset;
  videoId = id;
  const title = "동영상 삭제";
  const text = "동영상을 완전히 삭제할까요?";
  const cancle = "취소";
  const confirm = "삭제";
  const ok = showingModal(title, text, cancle, confirm);
  ok.addEventListener("click", handleRemoveVideo);
};

deleteBtn.addEventListener("click", handleDelete);

// 그룹에 추가하기 버튼 작동
const groupBtn = document.querySelector(".video__title-groupBtn");
const groups = document.querySelectorAll(".group-checkbox");
const videoContainer = document.getElementById("video-container"); // 비디오 id fetch에 필요
const popupWrapper = document.querySelector(".pop-up__wrapper");
const groupList = document.querySelector(".pop-up__group.hidden");
const CHANGE = "checkbox-changed"; // 체크박스 input 변경 시 classList에 추가될 이름

const groupFetch = async (URL, groupId, videoId) => {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      groupId,
      videoId,
    }),
  });
  return response;
};

const handleAddVideo = () => {
  groups.forEach(async (item) => {
    if (item.classList.contains(CHANGE)) {
      const groupId = item.id;
      const videoId = videoContainer.dataset.id;
      if (item.checked) {
        const response = await groupFetch(
          "/api/groups/addvideo",
          groupId,
          videoId
        );
      } else {
        const response = await groupFetch(
          "/api/groups/deletevideo",
          groupId,
          videoId
        );
      }
      item.classList.remove(CHANGE);
    }
  });
  popupWrapper.classList.add("hidden");
  groupList.classList.add("hidden");
  addFlashMessage("info", "비디오가 그룹에 추가/삭제 되었습니다.");
};

const handleGroupClick = () => {
  // 그룹 저장 여부 불러오기
  groups.forEach(async (item) => {
    const groupId = item.id;
    const videoId = videoContainer.dataset.id;
    const response = await groupFetch("/api/groups/scan", groupId, videoId);
    const json = await response.json();
    if (json.exists) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  });

  groupList.classList.remove("hidden");
  const title = "그룹에 추가";
  let text;
  let confirm;
  if (!groups) {
    text = "생성된 그룹이 없습니다.\n 그룹 추가 후 시도해주세요";
    confirm = "";
  } else {
    text = "";
    confirm = "추가 / 삭제";
  }
  const cancle = "취소";

  const ok = showingModal(title, text, cancle, confirm);
  if (ok) {
    ok.addEventListener("click", handleAddVideo);
  }
};

const handleCheckboxClick = (event) => {
  const changed = event.target.classList.contains(CHANGE);
  if (changed) {
    event.target.classList.remove(CHANGE);
  } else {
    event.target.classList.add(CHANGE);
  }
};

groupBtn.addEventListener("click", handleGroupClick);
groups.forEach((item) => {
  item.addEventListener("click", handleCheckboxClick);
});
