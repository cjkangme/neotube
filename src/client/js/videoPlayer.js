const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const currentTimeSpan = document.querySelector("#current-time");
const totalTimeSpan = document.querySelector("#total-time");
const volumeInput = document.querySelector("#volume");

let volume = 0.5;
video.volume = volume;

console.log(playBtn);

// sub function

const formatTime = (time) => {
  const min = String(Math.floor(time / 60)).padStart(2, "0");
  const sec = String(Math.floor(time % 60)).padStart(2, "0");
  return `${min}:${sec}`;
};

// event function
const handleLoadedMetadata = () => {
  const { duration } = video;
  totalTimeSpan.innerText = formatTime(duration);
};

const handleTimeUpdate = () => {
  const { currentTime } = video;
  currentTimeSpan.innerText = formatTime(currentTime);
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

video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);

muteBtn.addEventListener("click", handleMuteClick);
video.addEventListener("volumechange", handleVolumeChange);
volumeInput.addEventListener("input", handleVolumeInput);

video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
playBtn.addEventListener("click", handlePlayClick);
