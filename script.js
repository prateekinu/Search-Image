const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".close");
const downloadImgBtn = lightBox.querySelector(".dnld");

const apiKey = "Q099BD8dQQfPBBhmhLiH21wvaXd9LgPg4nO6kVxCttHq7IrdY8c1WZ0E";
const per_page = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) =>{
    fetch(imgURL).then(res => res.blob()).then((file) =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(()=> alert("Failed to download Image!"));
}

const showLightbox = (name,img) =>{
    lightBox.querySelector("img").src = img;
    lightBox.querySelector(".name").innerText = name;
    downloadImgBtn.setAttribute("data-img", img)
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map( img =>
        `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <span class="material-symbols-outlined">photo_camera</span>
                    <span class="name">${img.photographer}</span>
                </div>
                <button onclick = "downloadImg('${img.src.large2x}')">
                    <span class="material-symbols-outlined">download</span>
                </button>
            </div>
        </li>`
        ).join("")
}

const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL,{
        headers: {Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        console.log(data);
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(()=> alert("Failed to load images!"));
}

const loadMoreImages = () =>{
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${per_page}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${per_page}`:apiURL
    getImages(apiURL);
}

const loadSearchImages = (e) =>{
    if(e.target.value === "") return searchTerm=null;
    if(e.key === "Enter")
    {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${per_page}`);
    }
}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${per_page}`);

loadMoreBtn.addEventListener("click",loadMoreImages);
searchInput.addEventListener("keyup",loadSearchImages);
closeBtn.addEventListener("click",hideLightBox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));

