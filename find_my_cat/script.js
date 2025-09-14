// === 설정 ===
const API_KEY = "여기에_본인_API_KEY_입력"; 
const SEARCH_ENGINE_ID = "여기에_본인_CX_입력";
const query = "cat meme";   // 작은 이미지
const query_2 = "house";    // 배경 이미지

let gifs = [];
let pictures = [];
let currentIndex = 0;
let currentIndex_2 = 0;
let score = 0; // 점수 변수

// 로컬스토리지에서 불러오기
function getImagesFromCache(key) {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : [];
}

// 로컬스토리지에 저장
function cacheImages(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

// 이미지 가져오기
async function fetchImages(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items?.map(item => item.link) || [];
  } catch (error) {
    console.error(`${query} 이미지 로딩 실패:`, error);
    return [];
  }
}

// 첫 이미지 표시
function displayImages(gif, picture) {
  const myImage = document.getElementById("myImage");
  const backGround = document.getElementById("backGround");

  myImage.src = gif;
  backGround.src = picture;

  myImage.style.display = "block";
  backGround.style.display = "block";

  setRandomPosition();
}

// 이미지 교체
function changeImage() {
  if (gifs.length > 0 && pictures.length > 0) {
    currentIndex = (currentIndex + 1) % gifs.length;
    currentIndex_2 = (currentIndex_2 + 1) % pictures.length;

    document.getElementById("myImage").src = gifs[currentIndex];
    document.getElementById("backGround").src = pictures[currentIndex_2];

    setRandomPosition();
    
    // ✅ 점수 올리기
    score++;
    document.getElementById("scoreBoard").innerText = `score: ${score}`;
  }
}

// 랜덤 위치
function setRandomPosition() {
  const myImage = document.getElementById("myImage");
  const bodyWidth = window.innerWidth;
  const bodyHeight = window.innerHeight;
  const imgWidth = myImage.offsetWidth || 80;
  const imgHeight = myImage.offsetHeight || 80;

  const randomX = Math.floor(Math.random() * (bodyWidth - imgWidth));
  const randomY = Math.floor(Math.random() * (bodyHeight - imgHeight));

  myImage.style.left = `${randomX}px`;
  myImage.style.top = `${randomY}px`;
}

// 새 이미지 불러오기
async function loadNewImages() {
  document.getElementById("loading").style.display = "block";

  gifs = await fetchImages(query);
  pictures = await fetchImages(query_2);

  if (gifs.length > 0 && pictures.length > 0) {
    displayImages(gifs[0], pictures[0]);
    cacheImages("gifImages", gifs);
    cacheImages("jpgImages", pictures);
    document.getElementById("loading").style.display = "none";
  } else {
    document.getElementById("loading").innerText = "이미지 로딩에 실패했습니다. 나중에 다시 시도해주세요.";
  }
}

// 캐시 불러오기 or 새로 로딩
async function loadImages() {
  const cachedGif = getImagesFromCache("gifImages");
  const cachedJpg = getImagesFromCache("jpgImages");

  if (cachedGif.length > 0 && cachedJpg.length > 0) {
    gifs = cachedGif;
    pictures = cachedJpg;
    displayImages(gifs[0], pictures[0]);
    document.getElementById("loading").style.display = "none";
  } else {
    await loadNewImages();
  }
}

// 페이지 로딩 시 실행
loadImages();
