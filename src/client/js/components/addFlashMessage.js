// flash message 생성
const addFlashMessage = (type, text) => {
  const main = document.querySelector("main");
  const message = document.createElement("div");
  message.className = `flash-message ${type}`;
  message.appendChild(document.createElement("div"));

  const span = document.createElement("span");
  span.innerText = text;
  message.appendChild(span);
  main.prepend(message);

  setTimeout(() => {
    message.remove();
  }, 5000);
};

export default addFlashMessage;
