// 현재 작동 안하는 코드

const videoContainer = document.getElementById("video-container");

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//  after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 1) 동영상이 준비되면 발생하는 함수
function onPlayerReady(event) {}

// 2) 플레이어의 상태에 따른 이벤트
function onPlayerStateChange(event) {
  if (event.data === 0) {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
      method: "POST",
    });
  }
}
