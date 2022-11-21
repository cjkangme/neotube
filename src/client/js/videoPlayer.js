const video = document.querySelector("video");
const videoContainer = document.querySelector("#video-container");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const currentTimeSpan = document.querySelector("#current-time");
const totalTimeSpan = document.querySelector("#total-time");
const volumeInput = document.querySelector("#volume");
const timeline = document.querySelector("#timeline");
const fullscreenBtn = document.querySelector("#fullscreen");

let volume = 0.5;
video.volume = volume;

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
};

const handlePause = () => {
  playBtn.innerText = "Play";
};

const handlePlay = () => {
  playBtn.innerText = "Pause";
};

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handleVolumeChange = () => {
  muteBtn.innerText =
    video.muted || volumeInput.value < 0.02 ? "Unmute" : "Mute";
};

const handleVolumeInput = (event) => {
  const value = event.target.value;
  video.volume = value;
};

const handleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullscreenChange = () => {
  if (document.fullscreenElement) {
    fullscreenBtn.innerText = "Exit";
  } else {
    fullscreenBtn.innerText = "Fullscreen";
  }
};

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
