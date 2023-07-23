var search = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");

var list = document.getElementById("list");
var pagination = document.getElementById("pagination");

var details = document.getElementById("details");

var movieList = [];
var movieInfo = {};
var movieDetails = {};
var fetchError = "";

var ratings = JSON.parse(localStorage.getItem("ratings"));
if (ratings == null) ratings = [];

const apiKey = "62a2f146";
const url = (text) => {
  return `https://www.omdbapi.com/?${text}&apikey=${apiKey}`;
};

const fetchSearch = (text, page) => {
  pagination.innerHTML = "";
  renderListSearching();
  fetch(url(`s=${text}&page=${page}`))
    .then((response) => response.json())
    .then((data) => {
      if (data.Response == "True") {
        movieList = data.Search;
        renderList();
        renderPagination(Math.ceil(data.totalResults / 10), page, text);
      } else {
        fetchError = data.Error;
        renderListError();
      }
    });
};

const fetchDetails = (imdbID) => {
  details.className = "show";
  renderDetailsLoading();
  fetch(url(`i=${imdbID}`))
    .then((response) => response.json())
    .then((data) => {
      if (data.Response == "True") {
        movieDetails = data;
        renderDetails();
      } else {
        fetchError = data.Error;
        renderDetailsError();
      }
    });
};

const movieCard = (movie) => {
  var movieItem = document.createElement("div");
  movieItem.className = "movie-item";
  movieItem.innerHTML = `
    <div class="card-image">
      <img src=${
        movie.Poster == "N/A" ? "images/image-placeholder.png" : movie.Poster
      } />
    </div>
    <div class="card-details">
      <h2 class="card-title">${movie.Title}</h2>
      <span class="card-year">${movie.Year}</span>
      <span> | </span>
      <span class="card-type">${movie.Type}</span>
    </div>
  `;
  movieItem.onclick = () => fetchDetails(movie.imdbID);
  return movieItem;
};

var paginationItem = (n, text, isActive) => {
  var movieItem = document.createElement("button");
  movieItem.className = "pagination-item" + (isActive ? " current" : "");
  movieItem.innerHTML = n;
  movieItem.onclick = () => {
    fetchSearch(text, n);
  };
  return movieItem;
};

const renderListError = () => {
  console.log(fetchError);
  list.innerHTML = `
    <div id="list-error">
      ${fetchError}
    </div>
  `;
};

const renderListSearching = () => {
  list.innerHTML = `
    <div id="list-searching">
      Searching...
    </div>
  `;
};

const renderList = () => {
  console.log(movieList);
  list.innerHTML = "";
  movieList.forEach((movie) => {
    list.appendChild(movieCard(movie));
  });
};

const renderPagination = (total, current, text) => {
  console.log("pagination: " + total + " " + current);
  pagination.innerHTML = `
    <button id="prev-button" ${current == 1 ? "disabled" : ""}>Prev</button>
    <span>Page ${current} of ${total}</span>
    <button id="next-button" ${current == total ? "disabled" : ""}>Next</button>
  `;
  pagination.querySelectorAll("button")[0].onclick = () => {
    fetchSearch(text, current - 1);
  };
  pagination.querySelectorAll("button")[1].onclick = () => {
    console.log("next");
    fetchSearch(text, current + 1);
  };
};

const renderDetailsError = () => {
  console.log(fetchError);
  details.innerHTML = `
    <div id="details-inner">
      <div id="details-error">
        ${fetchError}
      </div>
    </div>
  `;
};

const renderDetailsLoading = () => {
  details.innerHTML = `
    <div id="details-inner">
      <div id="details-loading">
        Loading...
      </div>
    </div>
  `;
};

const renderDetails = () => {
  console.log(movieDetails);
  console.log(details.className);
  var ratingNo = -1;
  ratings.forEach((rating, i) => {
    if (rating.id == movieDetails.imdbID) {
      ratingNo = i;
    }
  });
  details.innerHTML = `
    <div id="details-inner">
      <button id="details-close"><span>X</span></button>
      <div id="details-image">
        <img src="${
          movieDetails.Poster == "N/A"
            ? "images/image-placeholder.png"
            : movieDetails.Poster
        }" />
      </div>
      <div id="details-contents">
        <span>Title: <strong>${movieDetails.Title}</strong></span>
        <span>Type: <strong>${movieDetails.Type}</strong></span>
        <span>Rated: <strong>${movieDetails.Rated}</strong></span>
        <span>Released: <strong>${movieDetails.Released}</strong></span>
        <span>Runtime: <strong>${movieDetails.Runtime}</strong></span>
        <span>IMDb Rating: <strong>${movieDetails.imdbRating} (${
    movieDetails.imdbVotes
  } votes)</strong></span>
        <span>Genre: <strong>${movieDetails.Genre}</strong></span>
        <span>Language: <strong>${movieDetails.Language}</strong></span>
        <span>Director: <strong>${movieDetails.Director}</strong></span>
        <span>Writer: <strong>${movieDetails.Writer}</strong></span>
        <span>Actors: <strong>${movieDetails.Actors}</strong></span>
        <span>Plot: <strong>${movieDetails.Plot}</strong></span>
        <div id="ratings">
          <input id="rating-slider" type="range" min="0" max="5" value="${
            ratingNo == -1 ? 0 : ratings[ratingNo].rating
          }"/>
          <span id="rating-label">
            Rating: <strong>${
              ratingNo == -1 ? 0 : ratings[ratingNo].rating
            }</strong> stars
          </span>
          <textarea id="rating-comment" rows="2" placeholder="Comments">${
            ratingNo == -1 ? "" : ratings[ratingNo].comment
          }</textarea>
          <button id="rating-submit">Save</button>
        </div>
      </div>
    </div>
  `;
  var ratingSlider = document.getElementById("rating-slider");
  var ratingSliderLabel = document.getElementById("rating-label");
  var ratingComment = document.getElementById("rating-comment");
  var ratingSubmit = document.getElementById("rating-submit");
  var closeButton = document.getElementById("details-close");
  closeButton.onclick = () => {
    details.className = "";
  };
  ratingSlider.oninput = () => {
    ratingSliderLabel.innerHTML = `Rating: <strong>${ratingSlider.value}</strong> stars`;
  };
  ratingSubmit.onclick = () => {
    ratingItem = {
      id: movieDetails.imdbID,
      rating: ratingSlider.value,
      comment: ratingComment.value,
    };
    if (ratingNo == -1) {
      ratings.push(ratingItem);
    } else {
      ratings[ratingNo] = ratingItem;
    }
    localStorage.setItem("ratings", JSON.stringify(ratings));
  };
};

search.onkeydown = (e) => {
  if (e.key == "Enter" && search.value != "") {
    fetchSearch(search.value, 1);
  }
};
searchButton.onclick = () => {
  if (search.value == "") return;
  fetchSearch(search.value, 1);
};
details.onclick = (e) => {
  if (e.target == details) details.className = "";
};

fetchSearch("movie", 1);
