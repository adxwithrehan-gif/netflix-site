const API_KEY = "e0454b55527f15c2784604a0bc84df14";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const trendingRow = document.getElementById("trending-row");
const topRatedRow = document.getElementById("top-rated-row");
const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroOverview = document.getElementById("hero-overview");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalOverview = document.getElementById("modal-overview");
const closeModal = document.querySelector(".close");
const searchInput = document.getElementById("search");

async function fetchMovies() {
    try {
        const trendingRes = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        const trendingData = await trendingRes.json();
        displayMovies(trendingData.results, trendingRow);
        
        if(trendingData.results.length > 0) {
            const featured = trendingData.results[0];
            hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`;
            heroTitle.innerText = featured.title || featured.name;
            heroOverview.innerText = featured.overview;
        }

        const topRes = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
        const topData = await topRes.json();
        displayMovies(topData.results, topRatedRow);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMovies(movies, element) {
    element.innerHTML = "";
    movies.forEach(movie => {
        if(!movie.poster_path) return;
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `<img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">`;
        card.addEventListener("click", () => {
            modalTitle.innerText = movie.title || movie.name;
            modalOverview.innerText = movie.overview;
            modal.style.display = "flex";
        });
        element.appendChild(card);
    });
}

closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });

searchInput.addEventListener("input", async (e) => {
    const query = e.target.value;
    if(query.trim() === "") {
        fetchMovies();
        return;
    }
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    displayMovies(data.results, trendingRow);
});

fetchMovies();
