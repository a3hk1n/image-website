// ELEMENTS
const loadingImage = document.querySelector(".loading-img");
const photosListContainer = document.getElementById("image-list-container");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-btn");
const notFoundImage = document.querySelector(".not-found-img");
const pagination = document.querySelector(".pagination");
const pageButtons = document.querySelectorAll(".page-btn");

let currentPage = 1;
let lastUrl = null;

// API DATA
const API_KEY = "unC7EowvNzow4VYV66oo8BdYGBSHm0RbaD65a_9X2Kc";
const API_URL = `https://api.unsplash.com/photos?page=${currentPage}&client_id=${API_KEY}`;
const SEARCH_API = `https://api.unsplash.com/search/photos?page=${currentPage}&client_id=${API_KEY}&query=`;

// Get Photos From API
const getPhotos = async (url) => {
  lastUrl = url;

  try {
    const response = await fetch(url);
    const data = await response.json();

    loadingImage.style.display = "none";
    notFoundImage.style.display = "none";
    pagination.style.display = "flex";

    if (data.results) {
      showPhotos(data.results);
    } else {
      showPhotos(data);
    }

    window.scrollTo({
      top: 0,
      right: 0,
      behavior: "smooth",
    });
  } catch (error) {
    photosListContainer.innerHTML = `<h2 class='error-message'>${error.message}</h2>`;
    loadingImage.style.display = "none";
  }
};

// Show Photos In DOM
const showPhotos = (photos) => {
  photosListContainer.innerHTML = "";
  if (photos.length) {
    photos.forEach((photo) => {
      const { urls } = photo;

      const image = `
    <div class="image-item">
      <img
        src="${urls.regular}"
        alt="Image"
        class="image"
      />
    </div>
    `;

      photosListContainer.innerHTML += image;
    });
  } else {
    notFoundImage.style.display = "block";
    pagination.style.display = "none";
  }
};

// Search Photos From API
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const inputValue = searchInput.value;

  if (inputValue) {
    photosListContainer.innerHTML = "";
    loadingImage.style.display = "block";
    notFoundImage.style.display = "none";
    pagination.style.display = "none";

    // active first page button
    pageButtons.forEach((btn) => btn.classList.remove("active"));
    document.querySelector("[data-page='1']").classList.add("active");

    getPhotos(SEARCH_API + inputValue);
    searchInput.value = "";
  }
});

pageButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    pageButtons.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");

    // get page & call API
    const buttonPage = btn.dataset.page;
    callPage(buttonPage);
  });
});

const callPage = (page) => {
  const urlSplit = lastUrl.split("?");

  const searchParams = new URLSearchParams(urlSplit[1]);
  searchParams.set("page", page);

  const url = urlSplit[0] + "?" + searchParams.toString();

  getPhotos(url);
};

// Initial Call API
getPhotos(API_URL);
