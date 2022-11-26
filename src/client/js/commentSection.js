const videoContainer = document.querySelector("#video-container");
const form = document.querySelector(".video__comment-form");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const addComment = (text) => {
  const user = document.querySelector(".header__username");
  const avatarUrl = document.querySelector(".header__avatarUrl");
  const time = new Date();
  const videoComments = document.querySelector(".video__comments");
  const newComment = document.createElement("div");
  newComment.className = "video__comment";
  const avatar = document.createElement("div");
  avatar.className = "comment__avatar";
  const image = document.createElement("img");
  image.src = avatarUrl.src;
  avatar.appendChild(image);
  const owner = document.createElement("div");
  owner.innerText = user.innerText;
  owner.className = "comment__owner";
  const created = document.createElement("div");
  created.innerText = time.toISOString().substring(0, 10);
  created.className = "comment__created";
  const content = document.createElement("div");
  content.innerText = text;
  content.className = "comment__text";
  newComment.appendChild(avatar);
  newComment.appendChild(owner);
  newComment.appendChild(created);
  newComment.appendChild(content);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      videoId,
    }),
  });
  console.log(status);
  if (status == 201) {
    addComment(text);
  }
  textarea.value = "";
};

form.addEventListener("submit", handleSubmit);
