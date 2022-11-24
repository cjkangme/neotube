import "../scss/styles.scss";

import "./components/header";

const flashMessage = document.querySelector(".flash-message");

setTimeout(() => {
  flashMessage.remove();
}, 5000);
