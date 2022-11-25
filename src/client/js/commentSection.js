const videoContainer = document.querySelector("#video-container");
const form = document.querySelector(".video__comment-form");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    fetch(`/api/videos/${videoId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        videoId,
      }),
    });
  }
};

form.addEventListener("submit", handleSubmit);
