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
      video: { width: 1280, height: 720 },
    });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    // handle the error
  }
};

const handleStart = async () => {
  startBtn.classList.remove("hidden");
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

// download
const createDownload = (url, fileName) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.classList.add("hidden");
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  startBtn.innerText = "Downloading";
  startBtn.disabled = true;
  restartBtn.disabled = true;

  const INPUTFILE = "recording.webm";
  const OUTPUTFILE = "output.mp4";
  const THUMBNAIL = "thumbnail.jpg";

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", INPUTFILE, await fetchFile(videoFile));
  await ffmpeg.run("-i", INPUTFILE, "-r", "30", OUTPUTFILE);
  await ffmpeg.run(
    "-i",
    INPUTFILE,
    "-ss",
    "00:00:02",
    "-frames:v",
    "1",
    THUMBNAIL
  );

  const mp4File = ffmpeg.FS("readFile", OUTPUTFILE);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4URL = URL.createObjectURL(mp4Blob);
  let thumbFile;
  // 영상길이가 00:00:02초보다 짧을 경우 THUMBNAIL이 저장되지 않아 발생하는 오류 대비
  try {
    thumbFile = ffmpeg.FS("readFile", THUMBNAIL);
  } catch {
    await ffmpeg.run(
      "-i",
      INPUTFILE,
      "-ss",
      "00:00:00",
      "-frames:v",
      "1",
      THUMBNAIL
    );
    thumbFile = ffmpeg.FS("readFile", THUMBNAIL);
  }
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const thumbURL = URL.createObjectURL(thumbBlob);

  createDownload(mp4URL, "MyRecording.mp4");
  createDownload(thumbURL, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", OUTPUTFILE);
  ffmpeg.FS("unlink", THUMBNAIL);
  ffmpeg.FS("unlink", INPUTFILE);

  URL.revokeObjectURL(mp4URL);
  URL.revokeObjectURL(thumbURL);
  URL.revokeObjectURL(videoFile);

  startBtn.classList.add("hidden");
  startBtn.disabled = false;
  restartBtn.disabled = false;
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
