const dateStr = document.querySelectorAll(".video-mixin__createdAt");
const commentStr = document.querySelectorAll(".comment__created");
const videoDate = document.querySelector(".video__description-createdAt");
const userDate = document.querySelector(".profile__user-createdAt");

// mixin에서 보이는 업로드 날짜 format
const rtfTime = (items) => {
  items.forEach((item) => {
    const date = new Date(item.innerText);
    const now = Date.now();
    const dateNum = date.getTime(date);
    const relativeTime = dateNum - now;
    const relativeMin = parseInt(relativeTime / (1000 * 60));
    const relativeHour = parseInt(relativeMin / 60);
    const relativeDay = parseInt(relativeHour / 24);
    const relativeWeek = parseInt(relativeDay / 7);
    const relativeMonth = parseInt(relativeDay / 30);
    const relativeYear = parseInt(relativeDay / 365);
    let text;
    let formatNum;
    let type;

    const rtf = new Intl.RelativeTimeFormat("ko-KR");

    if (relativeYear <= -1) {
      formatNum = relativeYear;
      type = "year";
    } else if (relativeMonth <= -1) {
      formatNum = relativeMonth;
      type = "month";
    } else if (relativeWeek <= -1) {
      formatNum = relativeWeek;
      type = "week";
    } else if (relativeDay <= -1) {
      formatNum = relativeDay;
      type = "day";
    } else if (relativeHour <= -1) {
      formatNum = relativeHour;
      type = "hour";
    } else if (relativeMin <= -1) {
      formatNum = relativeMin;
      type = "minute";
    } else {
      formatNum = 0;
    }

    if (formatNum === 0) {
      text = "방금 전";
    } else {
      text = rtf.format(formatNum, type);
    }
    item.innerText = text;
  });
};

const dtfTime = (item, text) => {
  if (item) {
    const date = new Date(item.dataset.date);
    const dtf = Intl.DateTimeFormat("ko-KR");
    const formattedDate = dtf.format(date);
    item.innerText = text + formattedDate;
  }
};

// watch 화면에서 보이는 업로드 날짜 포맷
rtfTime(dateStr);
rtfTime(commentStr);
dtfTime(videoDate, "업로드: ");
dtfTime(userDate, "");
