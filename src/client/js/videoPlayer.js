const localStorage = window.localStorage;

const video = document.querySelector("video");
const controls = document.querySelector(".controls-container");
const videoContainer = document.querySelector("#video-container");
const playBtn = document.querySelector("#play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.querySelector("#mute");
const muteIcon = muteBtn.querySelector("i");
const currentTimeSpan = document.querySelector("#current-time");
const totalTimeSpan = document.querySelector("#total-time");
const volumeInput = document.querySelector("#volume");
const timeline = document.querySelector("#timeline");
const fullscreenBtn = document.querySelector("#fullscreen");
const fullscreenIcon = fullscreenBtn.querySelector("i");
const loopBtn = document.querySelector("#loop");
const textarea = document.querySelector(".video__comment-textarea");

let volume = 0.5;
video.volume = volume;

let timeoutId;
let watchTime;

// sub function

const formatTime = (time) => {
  let timeString = new Date(time * 1000).toISOString().substring(11, 19);
  if (timeString.substring(0, 2) === "00") {
    return timeString.substring(3);
  } else {
    return timeString;
  }
};

// event function
const handleLoadedMetadata = () => {
  const { duration } = video;
  totalTimeSpan.innerText = formatTime(duration);
  timeline.max = Math.floor(duration);

  const mute = localStorage.getItem("mute");
  if (mute === "true") {
    video.muted = true;
    volumeInput.value = 0;
    muteIcon.className = "fas fa-volume-xmark";
  }

  const loop = localStorage.getItem("loop");
  console.log(loop);
  if (loop === "true") {
    loopBtn.classList.add("active");
  } else {
    loopBtn.classList.remove("active");
  }
};

const handleTimeUpdate = () => {
  const { currentTime } = video;
  currentTimeSpan.innerText = formatTime(currentTime);
  timeline.value = Math.floor(currentTime);
};

const handleTimeline = (event) => {
  video.currentTime = event.target.value;
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
    volumeInput.value = video.volume;
  } else {
    video.muted = true;
    volumeInput.value = 0;
  }
  muteIcon.className = video.muted ? "fas fa-volume-xmark" : "fas fa-volume";
};

const handlePause = () => {
  playIcon.className = "fas fa-play";
};

const handlePlay = () => {
  playIcon.className = "fas fa-pause";
};

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handleVolumeChange = () => {
  muteIcon.className =
    video.muted || volumeInput.value < 0.02
      ? "fas fa-volume-xmark"
      : "fas fa-volume-high";
};

const handleVolumeInput = (event) => {
  const value = event.target.value;
  if (value > 0.02) {
    video.muted = false;
  }
  video.volume = value;
  muteIcon.className =
    video.muted || volumeInput.value < 0.02
      ? "fas fa-volume-xmark"
      : "fas fa-volume-high";
};

const handleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullscreenChange = () => {
  fullscreenIcon.className = document.fullscreenElement
    ? "fas fa-compress"
    : "fas fa-expand";
};

const showControls = (setTime) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  timeoutId = setTimeout(() => {
    if (!video.paused) {
      controls.classList.add("hidden");
    }
  }, setTime);
};

const handleMouseMove = () => {
  showControls(2000);
  controls.classList.remove("hidden");
};

const handleMouseLeave = () => {
  showControls(500);
};

const handleLoop = () => {
  if (video.loop) {
    video.loop = false;
    loopBtn.classList.remove("active");
  } else {
    video.loop = true;
    loopBtn.classList.add("active");
  }
};

const handleVideoClick = () => {
  handlePlayClick();
};

const handleKeyup = (event) => {
  if (document.activeElement !== textarea) {
    if (event.keyCode === 32) {
      handlePlayClick();
    }
  }
};

const handleKeydown = (event) => {
  if (document.activeElement !== textarea) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }
};

// Video API
const handleEnded = () => {
  const id = video.dataset.id;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

if (video.readyState >= 2) {
  handleLoadedMetadata();
}

// Video Controls
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimeline);

muteBtn.addEventListener("click", handleMuteClick);
video.addEventListener("volumechange", handleVolumeChange);
volumeInput.addEventListener("input", handleVolumeInput);

video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
playBtn.addEventListener("click", handlePlayClick);

fullscreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("fullscreenchange", handleFullscreenChange);

videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

loopBtn.addEventListener("click", handleLoop);

video.addEventListener("click", handleVideoClick);
window.addEventListener("keyup", handleKeyup);
window.addEventListener("keydown", handleKeydown);

video.addEventListener("ended", handleEnded);
