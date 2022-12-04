const userProfile = document.querySelector(".header__user");
const userProfileList = document.querySelector(".header__profile-list");
const navToggle = document.querySelector(".header__toggle");
const nav = document.querySelector("nav");
const main = document.querySelector("main");
const videos = document.querySelectorAll(".video-grid");

const handleProfileClick = () => {
  userProfileList.classList.toggle("hidden");
};

const handleNavToggleClick = () => {
  nav.classList.toggle("hidden");
  main.classList.toggle("toggled");
  videos.forEach((item) => {
    item.classList.toggle("video-grid--toggled");
  });
};

userProfile.addEventListener("click", handleProfileClick);
navToggle.addEventListener("click", handleNavToggleClick);
