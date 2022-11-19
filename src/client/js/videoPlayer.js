const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const time = document.querySelector("#time");
const volume = document.querySelector("#volume");

console.log(playBtn, mute, time, volume);

const handleMuteClick = (event) => {};

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

muteBtn.addEventListener("click", handleMuteClick);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
playBtn.addEventListener("click", handlePlayClick);
