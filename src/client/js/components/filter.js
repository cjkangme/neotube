const filter = () => {
  const localStorage = window.localStorage;
  const allVideos = document.querySelectorAll(".video-container");
  const videos = document.querySelectorAll(".youtube-false");
  const youtubes = document.querySelectorAll(".youtube-true");

  const option = localStorage.getItem("filter");
  if (option === "all") {
    allVideos.forEach((item) => {
      item.classList.remove("hidden");
    });
  } else if (option === "video") {
    videos.forEach((item) => {
      item.classList.remove("hidden");
    });
    youtubes.forEach((item) => {
      item.classList.add("hidden");
    });
  } else if (option === "youtube") {
    videos.forEach((item) => {
      item.classList.add("hidden");
    });
    youtubes.forEach((item) => {
      item.classList.remove("hidden");
    });
  }
};

export default filter;
