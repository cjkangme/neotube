import { showingModal } from "./createModal.js";

const videoContainer = document.querySelector("#video-container");
const form = document.querySelector(".video__comment-form");
const textarea = form.querySelector("textarea");
const addCommentBtn = form.querySelector("button");
const removeBtns = document.querySelectorAll(".comment__remove");

let id;

const handleRemove = async () => {
  const popupWrapper = document.querySelector(".pop-up__wrapper");
  popupWrapper.classList.add("hidden");
  const response = await fetch(`/api/videos/${id}/comment/delete`, {
    method: "POST",
  });
  const json = await response.json();
  if (response.status == 200) {
    const deletedComment = document.getElementById("deletedComment");
    deletedComment.parentNode.remove();
    window.location.href = `/videos/${json.videoId}`;
  }
};

const handleRemoveClick = (event) => {
  id = event.target.dataset.id;
  const title = "댓글 삭제";
  const text = "댓글을 완전히 삭제할까요?";
  const cancle = "취소";
  const confirm = "삭제";
  event.target.id = "deletedComment";

  const ok = showingModal(title, text, cancle, confirm);
  ok.addEventListener("click", handleRemove);
};

const addComment = (text, json) => {
  const user = document.querySelector(".header__username");
  const avatarUrl = document.querySelector(".header__avatarUrl");
  const time = new Date();
  const videoComments = document.querySelector(".video__comments");

  // fake comment 생성
  const newComment = document.createElement("div");
  newComment.className = "video__comment";

  const avatar = document.createElement("a");
  avatar.href = `/users/${json.id}`;
  avatar.className = "comment__avatar";

  if (avatarUrl) {
    const image = document.createElement("img");
    image.src = avatarUrl.src;
    avatar.appendChild(image);
  } else {
    const iconContainer = document.createElement("div");
    iconContainer.className = "comment__avatar-icon";
    const icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-user");
    iconContainer.appendChild(icon);
    avatar.appendChild(iconContainer);
  }

  const owner = document.createElement("div");
  owner.innerText = user.innerText;
  owner.className = "comment__owner";

  const created = document.createElement("div");
  created.innerText = time.toISOString().substring(0, 10);
  created.className = "comment__created";

  const content = document.createElement("div");
  content.innerText = text;
  content.className = "comment__text";

  const button = document.createElement("button");
  button.className = "comment__remove fas fa-xmark";
  button.setAttribute("data-id", json.id);
  button.addEventListener("click", handleRemoveClick);

  newComment.appendChild(avatar);
  newComment.appendChild(owner);
  newComment.appendChild(created);
  newComment.appendChild(content);
  newComment.appendChild(button);
  videoComments.prepend(newComment);

  // flash message 생성
  const main = document.querySelector("main");
  const message = document.createElement("div");
  message.className = "flash-message info";
  message.appendChild(document.createElement("div"));

  const span = document.createElement("span");
  span.innerText = "댓글이 작성되었습니다.";
  message.appendChild(span);
  main.prepend(message);

  setTimeout(() => {
    message.remove();
  }, 5000);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      videoId,
    }),
  });
  const json = await response.json();
  if (response.status == 201) {
    addComment(text, json);
  }
  textarea.value = "";
};

form.addEventListener("submit", handleSubmit);
removeBtns.forEach((obj) => {
  obj.addEventListener("click", handleRemoveClick);
});

// textarea resizing & active button
const handleTextareaKeypress = () => {
  textarea.style.height = "1px";
  textarea.style.height = 3 + textarea.scrollHeight + "px";

  if (textarea.value == "") {
    addCommentBtn.disabled = true;
  } else {
    addCommentBtn.disabled = false;
  }
};

textarea.addEventListener("keydown", handleTextareaKeypress);
textarea.addEventListener("keyup", handleTextareaKeypress);
