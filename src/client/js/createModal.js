const popupWrapper = document.querySelector(".pop-up__wrapper");
const popupContainer = document.querySelector(".pop-up__container");
const popupTitle = document.querySelector(".pop-up__title");
const popupText = document.querySelector(".pop-up__text");
const popupBtn = document.querySelector(".pop-up__btn-container");
const popupCancleBtn = document.querySelector(".pop-up__cancle");

export const showingModal = (title, text, cancle, confirm) => {
  const popupConfirmExists = document.getElementById("confirmExists");
  if (popupConfirmExists) {
    popupConfirmExists.remove();
  }
  popupTitle.innerText = title;
  popupText.innerText = text;
  popupCancleBtn.innerText = cancle;

  const popupConfirmBtn = document.createElement("button");
  popupConfirmBtn.classList.add("pop-up__confirm");
  popupConfirmBtn.id = "confirmExists";
  popupConfirmBtn.innerText = confirm;

  popupBtn.appendChild(popupConfirmBtn);
  popupWrapper.classList.remove("hidden");
  return popupConfirmBtn;
};

const handleCancleClick = () => {
  const popupConfirmExists = document.getElementById("confirmExists");
  if (popupConfirmExists) {
    popupConfirmExists.remove();
  }
  popupWrapper.classList.add("hidden");
};

popupCancleBtn.addEventListener("click", handleCancleClick);
