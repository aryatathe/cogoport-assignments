var search = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");

var list = document.getElementById("list");

var movieList = [];
var movieInfo = {};

const url = (text) => {
  return `https://www.omdbapi.com/?${text}&apikey=62a2f146`;
};

const fetchSearch = (text, page) => {
  fetch(url(`s=${text}&page=${page}`))
    .then((response) => response.json())
    .then((data) => {
      movieList = data.Search;
      renderList();
    });
};

const movieCard = (movie) => {
  var movieItem = document.createElement("div");
  movieItem.className = "movie-item";
  movieItem.innerHTML = movie.Title;
  return movieItem;
};

const renderList = () => {
  console.log(movieList);
  list.innerHTML = "";
  movieList.forEach((movie) => {
    list.appendChild(movieCard(movie));
  });
};

searchButton.onclick = () => {
  if (search.value == "") return;
  fetchSearch(search.value, 1);
  search.value = "";
};
