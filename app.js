const API_KEY = "e0454b55527f15c2784604a0bc84df14";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const trendingRow = document.getElementById("trending-row");
const actionRow = document.getElementById("action-row");
const horrorRow = document.getElementById("horror-row");
const comedyRow = document.getElementById("comedy-row");

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroOverview = document.getElementById("hero-overview");
const heroWatchBtn = document.getElementById("hero-watch-btn");
const heroDownloadBtn = document.getElementById("hero-download-btn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalOverview = document.getElementById("modal-overview");
const modalWatch = document.getElementById("modal-watch");
const modalDownload = document.getElementById("modal-download");
const closeModal = document.querySelector(".close");
const searchInput = document.getElementById("search");

async function fetchAllMovies() {
    try {
        // 1. Trending Movies (Daily automatically update hogi aur jo sabse nayi/popular hogi woh top Hero banner par aayegi)
        const trendingRes = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        const trendingData = await trendingRes.json();
        displayMovies(trendingData.results, trendingRow);
        
        if(trendingData.results.length > 0) {
            const featured = trendingData.results[0];
            hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`;
            heroTitle.innerText = featured.title || featured.name;
            heroOverview.innerText = featured.overview;
            
            // Dynamic watch/download links (Google search or TMDB search redirection)
            const searchName = encodeURIComponent(featured.title || featured.name);
            heroWatchBtn.onclick = () => window.open(`https://www.google.com/search?q=watch+${searchName}+online`, '_blank');
            heroDownloadBtn.onclick = () => window.open(`https://www.google.com/search?q=download+${searchName}+full+movie`, '_blank');
        }

        // 2. Action Movies (Genre ID: 28)
        const actionRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`);
        const actionData = await actionRes.json();
        displayMovies(actionData.results, actionRow);

        // 3. Horror Movies (Genre ID: 27)
        const horrorRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`);
        const horrorData = await horrorRes.json();
        displayMovies(horrorData.results, horrorRow);

        // 4. Comedy Movies (Genre ID: 35)
        const comedyRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`);
        const comedyData = await comedyRes.json();
        displayMovies(comedyData.results, comedyRow);

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
            
            const movieName = encodeURIComponent(movie.title || movie.name);
            modalWatch.href = `https://www.google.com/search?q=watch+${movieName}+online`;
            modalDownload.href = `https://www.google.com/search?q=download+${movieName}+full+movie`;
            
            modal.style.display = "flex";
        });
        element.appendChild(card);
    });
}

closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });

// Live Search Feature
searchInput.addEventListener("input", async (e) => {
    const query = e.target.value;
    if(query.trim() === "") {
        fetchAllMovies();
        return;
    }
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    displayMovies(data.results, trendingRow);
});

fetchAllMovies();
