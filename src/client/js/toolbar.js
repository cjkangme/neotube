import filter from "./components/filter";

const localStorage = window.localStorage;
const filterBtn = document.querySelector(".toolbar__filter-btn");
const filterDropdown = document.querySelector(".filter-dropdown");
const filterDropdownBtns = filterDropdown.querySelectorAll("div");
const sortBtn = document.querySelector(".toolbar__sort-btn");
const sortDropdown = document.querySelector(".sort-dropdown");

const dropdowns = document.querySelectorAll(".dropdown");
// function
const styleBtn = (element) => {
  const value = localStorage.getItem("filter");
  element.forEach((item) => {
    if (value === item.dataset.option) {
      item.style.color = "#ff9900";
    } else {
      item.style.color = "#fff";
    }
  });
};

styleBtn(filterDropdownBtns);
filter();

// event
const handleFilterBtnClick = () => {
  filterDropdown.classList.toggle("hidden");
  sortDropdown.classList.add("hidden");
};

const handlefilterDropdownBtnClick = (event) => {
  const item = event.target;
  const { option } = item.dataset;
  localStorage.removeItem("filter");
  localStorage.setItem("filter", option);
  styleBtn(filterDropdownBtns);
  filter();
};

const handleSortBtnClick = () => {
  sortDropdown.classList.toggle("hidden");
  filterDropdown.classList.add("hidden");
};

filterBtn.addEventListener("click", handleFilterBtnClick);
filterDropdownBtns.forEach((item) => {
  item.addEventListener("click", handlefilterDropdownBtnClick);
});

sortBtn.addEventListener("click", handleSortBtnClick);
