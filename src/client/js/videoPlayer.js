const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const time = document.querySelector("#time");
const volumeInput = document.querySelector("#volume");

let volume = 0.5;
video.volume = volume;

console.log(playBtn, mute, time, volume);

const handleMuteClick = (event) => {
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

muteBtn.addEventListener("click", handleMuteClick);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("volumechange", handleVolumeChange);
volumeInput.addEventListener("input", handleVolumeInput);
