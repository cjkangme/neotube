import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.querySelector("#startBtn");
const videoContainer = document.querySelector("#preview-container");
const video = document.querySelector("#preview");

let stream;
let recorder;

let restartBtn;
let videoFile;

let timeoutId;

const init = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: 240, height: 160 },
    });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    // handle the error
  }
};

const handleStart = async () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.removeEventListener("click", handleDownload);
  startBtn.addEventListener("click", handleStop);

  if (!video.srcObject) {
    video.srcObject = stream;
    video.play();
  }

  if (restartBtn) {
    restartBtn.remove();
  }

  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });
  recorder.start();
  timeoutId = setTimeout(() => {
    handleStop();
  }, 5000);
};

const handleDownload = async () => {
  const INPUTFILE = "recording.webm";
  const OUTPUTFILE = "output.mp4";

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", INPUTFILE, await fetchFile(videoFile));
  await ffmpeg.run("-i", INPUTFILE, "-r", "30", OUTPUTFILE);

  const mp4File = ffmpeg.FS("readFile", OUTPUTFILE);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4URL = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4URL;
  a.download = "MyRecording.mp4";
  a.click();
  a.classList.add("hidden");
  document.body.appendChild(a);
};

const handleStop = async () => {
  restartBtn = document.createElement("button");
  restartBtn.innerText = "Restart";
  restartBtn.addEventListener("click", handleStart);
  videoContainer.appendChild(restartBtn);

  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  recorder.stop();
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.setAttribute("loop", "");
    video.play();
  };
};

init();

startBtn.addEventListener("click", handleStart);
