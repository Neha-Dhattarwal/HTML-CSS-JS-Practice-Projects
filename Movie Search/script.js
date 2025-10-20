const OMDB_API_KEY = "79f4d639"; // your API key (from omdbapi.com)
const SEARCH_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=movie&s=`;

const searchInput = document.getElementById("searchInput");
const showFavBtn = document.getElementById("showFavBtn");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");
const favoritesDiv = document.getElementById("favorites");

let favorites = loadFavorites();
let isShowingFavorites = false;

// ====== Debounce (to avoid calling API on every keystroke) ======
function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ====== Load favorites from localStorage ======
function loadFavorites() {
  try {
    const raw = localStorage.getItem("movie_favorites");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ====== Save favorites ======
function saveFavorites() {
  localStorage.setItem("movie_favorites", JSON.stringify(favorites));
}

// ====== Clear results ======
function clearResults() {
  resultsDiv.innerHTML = "";
}

// ====== Show status message ======
function showStatus(text) {
  statusDiv.textContent = text || "";
}

// ====== Create movie card ======
function createMovieCard(movie, isFavView = false) {
  const card = document.createElement("div");
  card.className = "card";

  const poster = document.createElement("div");
  poster.className = "poster";
  const img = document.createElement("img");
  img.alt = movie.Title;
  img.src =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Image";
  poster.appendChild(img);

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = movie.Title;

  const year = document.createElement("div");
  year.className = "year";
  year.textContent = movie.Year;

  const btn = document.createElement("button");
  if (isFavView) {
    btn.textContent = "Remove";
    btn.onclick = () => {
      favorites = favorites.filter((f) => f.imdbID !== movie.imdbID);
      saveFavorites();
      renderFavorites();
    };
  } else {
    const isAlready = favorites.some((f) => f.imdbID === movie.imdbID);
    btn.textContent = isAlready ? "In Favorites" : "Add to Favorites";
    btn.disabled = isAlready;
    btn.onclick = () => {
      if (!favorites.some((f) => f.imdbID === movie.imdbID)) {
        favorites.push(movie);
        saveFavorites();
        btn.textContent = "In Favorites";
        btn.disabled = true;
      }
    };
  }

  card.appendChild(poster);
  card.appendChild(title);
  card.appendChild(year);
  card.appendChild(btn);

  return card;
}

// ====== Render search results ======
async function renderSearchResults(movies) {
  clearResults();
  if (!movies || movies.length === 0) {
    showStatus("No results found.");
    return;
  }
  showStatus("");
  for (const m of movies) {
    resultsDiv.appendChild(createMovieCard(m, false));
  }
}

// ====== Render favorites ======
function renderFavorites() {
  favoritesDiv.innerHTML = "";
  if (favorites.length === 0) {
    favoritesDiv.innerHTML = `<div>No favorites yet. Add some movies!</div>`;
    return;
  }
  for (const f of favorites) {
    favoritesDiv.appendChild(createMovieCard(f, true));
  }
}

// ====== Fetch movies from OMDb ======
async function fetchMovies(query) {
  if (!query || query.trim().length < 1) {
    clearResults();
    showStatus("");
    return;
  }

  showStatus("Searching...");
  try {
    const resp = await fetch(SEARCH_URL + encodeURIComponent(query.trim()));
    const data = await resp.json();

    if (data.Response === "True" && data.Search) {
      const movies = data.Search.map((item) => ({
        Title: item.Title,
        Year: item.Year,
        Poster: item.Poster,
        imdbID: item.imdbID,
      }));
      await renderSearchResults(movies);
    } else {
      clearResults();
      showStatus(data.Error || "No results found.");
    }
  } catch (err) {
    clearResults();
    showStatus("Network or server error. Try again.");
    console.error("Fetch error", err);
  }
}

// ====== Debounced search handler ======
const debouncedSearch = debounce((ev) => {
  const q = ev.target.value;
  fetchMovies(q);
}, 500);

// ====== Show favorites button handler ======
showFavBtn.addEventListener("click", () => {
  isShowingFavorites = !isShowingFavorites;
  if (isShowingFavorites) {
    resultsDiv.classList.add("hidden");
    favoritesDiv.classList.remove("hidden");
    renderFavorites();
    showFavBtn.textContent = "Back to Search";
    showStatus("");
  } else {
    resultsDiv.classList.remove("hidden");
    favoritesDiv.classList.add("hidden");
    showFavBtn.textContent = "Show Favorites";
    showStatus("");
  }
});

// ====== Start search event ======
searchInput.addEventListener("input", debouncedSearch);

// ====== Initial load ======
renderFavorites();
