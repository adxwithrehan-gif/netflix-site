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

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalOverview = document.getElementById("modal-overview");
const modalVideo = document.getElementById("modal-video");
const closeModal = document.querySelector(".close");
const searchInput = document.getElementById("search");

async function fetchAllMovies() {
    try {
        // Latest / Now Playing Movies
        const latestRes = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
        const latestData = await latestRes.json();
        const sortedMovies = latestData.results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        
        displayMovies(sortedMovies, trendingRow);
        
        if(sortedMovies.length > 0) {
            const featured = sortedMovies[0];
            hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`;
            heroTitle.innerText = featured.title || featured.name;
            heroOverview.innerText = featured.overview;
            
            heroWatchBtn.onclick = () => {
                modalTitle.innerText = featured.title || featured.name;
                modalOverview.innerText = featured.overview;
                // Updated working embed player link
                modalVideo.src = `https://vidsrc.cc/v2/embed/movie/${featured.id}`;
                modal.style.display = "flex";
            };
        }

        // Action Movies
        const actionRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&sort_by=release_date.desc`);
        const actionData = await actionRes.json();
        displayMovies(actionData.results, actionRow);

        // Horror Movies
        const horrorRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&sort_by=release_date.desc`);
        const horrorData = await horrorRes.json();
        displayMovies(horrorData.results, horrorRow);

        // Comedy Movies
        const comedyRes = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&sort_by=release_date.desc`);
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
            // Updated working embed player link using vidsrc.cc
            modalVideo.src = `https://vidsrc.cc/v2/embed/movie/${movie.id}`;
            modal.style.display = "flex";
        });
        element.appendChild(card);
    });
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    modalVideo.src = "";
});

window.addEventListener("click", (e) => { 
    if(e.target === modal) {
        modal.style.display = "none";
        modalVideo.src = "";
    }
});

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
