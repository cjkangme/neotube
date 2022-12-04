const localStorage = window.localStorage;
const muteCheckbox = document.getElementById("mute");
const loopCheckbox = document.getElementById("loop");
const checkboxes = document.querySelectorAll(".setting-checkbox");

const storage = (key, item) => {
  const value = localStorage.getItem(key);
  if (value === null) {
    localStorage.setItem(key, "false");
  } else if (value === "true") {
    item.checked = true;
  }
};

const handleCheckboxChange = (event) => {
  const item = event.target;
  const { key } = item.dataset;
  if (item.checked) {
    localStorage.setItem(key, "true");
  } else {
    localStorage.setItem(key, "false");
  }
};

if (localStorage.getItem("mute") === null) {
  localStorage.setItem("mute", "false");
}
if (localStorage.getItem("loop") === null) {
  localStorage.setItem("loop", "false");
}

checkboxes.forEach((item) => {
  item.addEventListener("change", handleCheckboxChange);
  storage(item.dataset.key, item);
});
