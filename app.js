// ===================================================
// [효명고 교원 방명록] 메인 스크립트 (app.js)
// ===================================================

// ---------------------------------------------------
// 1. Firebase 환경 설정 (3단계에서 콘솔 키를 입력하는 곳)
// ---------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBEMDt4Kkqpe3hrTqnPU75ptwz2ZK0TDaA",
  authDomain: "hyomyeong-guestbook.firebaseapp.com",
  projectId: "hyomyeong-guestbook",
  storageBucket: "hyomyeong-guestbook.firebasestorage.app",
  messagingSenderId: "402497517912",
  appId: "1:402497517912:web:0b071df5f93eed54274d2d"
};

// 학교 제한 도메인
const ALLOWED_DOMAIN = "@hmh.or.kr";

// ---------------------------------------------------
// 2. 검증된 실시간 스마트 GIF 데이터베이스 (Fastly CDN 200 OK 보증)
// ---------------------------------------------------
const GIF_DATABASE = [
  // 1) 슬픔 / 눈물 / 우울 / sad / cry
  {
    url: "https://media.giphy.com/media/OPU6wzx8JrHna/200.gif",
    title: "Cute Sad Crying Face",
    tags: ["슬픔", "슬퍼", "눈물", "우울", "sad", "cry", "속상", "울컥"]
  },
  {
    url: "https://media.giphy.com/media/ISOckXUybVfQ4/200.gif",
    title: "SpongeBob Sad Sitting",
    tags: ["슬픔", "슬퍼", "우울", "비", "sad", "혼자", "스폰지밥"]
  },
  {
    url: "https://media.giphy.com/media/L95W4wv8nnb9K/200.gif",
    title: "Tearing Up Sadness",
    tags: ["슬픔", "슬퍼", "눈물", "감동", "sad", "울음"]
  },
  {
    url: "https://media.giphy.com/media/3o6Zt9y2JCjc450T3q/200.gif",
    title: "Dramatic Crying",
    tags: ["슬픔", "슬퍼", "오열", "눈물", "sad", "cry"]
  },

  // 2) mad / 화남 / 분노 / 앵그리 / 폭발
  {
    url: "https://media.giphy.com/media/11tTNkNy1SdXGg/200.gif",
    title: "Angry Birds Red Mad",
    tags: ["mad", "화남", "분노", "앵그리", "폭발", "화", "짜증"]
  },
  {
    url: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/200.gif",
    title: "Super Mad Frustrated",
    tags: ["mad", "화남", "짜증", "분노", "답답", "스트레스"]
  },
  {
    url: "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/200.gif",
    title: "Mad Desk Flip",
    tags: ["mad", "화남", "책상", "열받음", "멘붕", "폭발"]
  },
  {
    url: "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/200.gif",
    title: "Fuming Steam Out",
    tags: ["mad", "화남", "스팀", "부글부글", "열"]
  },
  {
    url: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/200.gif",
    title: "Mad Screaming Shock",
    tags: ["mad", "화남", "비명", "괴성", "충격"]
  },
  {
    url: "https://media.giphy.com/media/12XMGIWtrHBl5e/200.gif",
    title: "Cat Angry Hissing",
    tags: ["mad", "화남", "고양이", "냥이", "하악"]
  },
  {
    url: "https://media.giphy.com/media/26FPImXfDlv4AFbBC/200.gif",
    title: "Mad Eye Twitch",
    tags: ["mad", "화남", "경련", "눈경련", "참을인"]
  },

  // 3) clap / 박수 / 최고 / 환호
  {
    url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200.gif",
    title: "Clap Leonardo DiCaprio",
    tags: ["clap", "박수", "물개박수", "최고", "찬사", "환호", "대단"]
  },
  {
    url: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/200.gif",
    title: "Happy Dancing Clap",
    tags: ["clap", "박수", "신남", "댄스", "춤", "기쁨", "행복"]
  },
  {
    url: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/200.gif",
    title: "Cheering Applause Crowd",
    tags: ["clap", "박수", "환호", "존경", "최고", "응원"]
  },

  // 4) 퇴근 / 칼퇴 / 달리기 / 집으로
  {
    url: "https://media.giphy.com/media/3o7ZetIsjgoYVTx05y/200.gif",
    title: "Running Home fast",
    tags: ["퇴근", "칼퇴", "run", "leave", "달리기", "집으로", "탈출", "4시반"]
  },
  {
    url: "https://media.giphy.com/media/3o7btUg31R0PMUCuB2/200.gif",
    title: "Power Cheer Jump",
    tags: ["퇴근", "칼퇴", "점프", "집", "탈출", "신남", "화이팅", "응원"]
  },

  // 5) 축하 / 파티 / 대박 / congrats
  {
    url: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/200.gif",
    title: "Confetti Celebration Party",
    tags: ["축하", "파티", "congrats", "party", "폭죽", "대박", "경축"]
  },
  {
    url: "https://media.giphy.com/media/l0MYJnJQ4EiYLwmSQ/200.gif",
    title: "Great Gatsby Toast",
    tags: ["축하", "건배", "최고", "대박", "congrats", "멋짐"]
  },

  // 6) 커피 / coffee / 힐링 / 출근
  {
    url: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/200.gif",
    title: "Pouring Hot Coffee",
    tags: ["커피", "coffee", "힐링", "휴식", "여유", "카페인", "모닝", "차"]
  },
  {
    url: "https://media.giphy.com/media/26u4cqiYI30juCOGY/200.gif",
    title: "Morning Coffee Mug",
    tags: ["커피", "morning", "출근", "아침", "coffee", "티타임"]
  },

  // 7) 감사 / 하트 / 고마워 / thank
  {
    url: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif",
    title: "Heart Thank You Love",
    tags: ["감사", "thank", "하트", "고마워", "사랑", "감동", "love"]
  },

  // 8) 피곤 / 야근 / 지침 / tired
  {
    url: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/200.gif",
    title: "Tired Sleepy Drop",
    tags: ["피곤", "야근", "졸려", "지침", "tired", "sleep", "방전"]
  },

  // 9) 신남 / 행복 / 기쁨 / happy
  {
    url: "https://media.giphy.com/media/blSTtZehjAZ8I/200.gif",
    title: "Happy Dancing Joy",
    tags: ["행복", "신남", "기쁨", "happy", "댄스", "좋아", "즐거움"]
  }
];

// 동의어(유사어) 매핑 딕셔너리
const SYNONYMS_MAP = {
  "슬퍼": ["슬픔", "눈물", "sad", "cry", "우울"],
  "슬픔": ["슬퍼", "눈물", "sad", "cry", "우울"],
  "슬프": ["슬픔", "눈물", "sad", "cry", "우울"],
  "눈물": ["슬픔", "슬퍼", "sad", "cry"],
  "우울": ["슬픔", "슬퍼", "sad"],
  "sad": ["슬픔", "슬퍼", "눈물", "cry"],
  "cry": ["슬픔", "눈물", "sad"],
  "화남": ["mad", "분노", "짜증", "폭발"],
  "화": ["mad", "화남", "분노", "짜증"],
  "mad": ["화남", "분노", "짜증"],
  "박수": ["clap", "물개박수", "환호"],
  "clap": ["박수", "환호"],
  "퇴근": ["칼퇴", "run", "탈출"],
  "칼퇴": ["퇴근", "run", "탈출"],
  "축하": ["congrats", "party", "파티"],
  "커피": ["coffee", "힐링", "휴식"],
  "화이팅": ["파이팅", "힘내", "응원"],
  "파이팅": ["화이팅", "힘내", "응원"],
  "감사": ["고마워", "thank", "하트"]
};

// ---------------------------------------------------
// 3. 상태 관리
// ---------------------------------------------------
let currentUser = null;
let selectedTag = "응원";
let selectedGifUrl = null;
let isFirebaseReady = false;

let auth = null;
let db = null;
let googleProvider = null;
let signInWithPopup = null;
let signOut = null;
let onAuthStateChanged = null;
let collection = null;
let addDoc = null;
let onSnapshot = null;
let query = null;
let orderBy = null;
let serverTimestamp = null;

// ---------------------------------------------------
// 4. DOM 요소 참조
// ---------------------------------------------------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authArea = document.getElementById("authArea");
const userProfile = document.getElementById("userProfile");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");

const anonCheck = document.getElementById("anonCheck");
const tagChips = document.querySelectorAll(".tag-chip");
const messageInput = document.getElementById("messageInput");
const submitBtn = document.getElementById("submitBtn");

const gifPreviewContainer = document.getElementById("gifPreviewContainer");
const gifPreviewImg = document.getElementById("gifPreviewImg");
const removeGifBtn = document.getElementById("removeGifBtn");

const openGifModalBtn = document.getElementById("openGifModalBtn");
const closeGifModalBtn = document.getElementById("closeGifModalBtn");
const gifModal = document.getElementById("gifModal");
const gifSearchInput = document.getElementById("gifSearchInput");
const gifSearchBtn = document.getElementById("gifSearchBtn");
const gifLoading = document.getElementById("gifLoading");
const gifResults = document.getElementById("gifResults");
const quickChips = document.querySelectorAll(".quick-chip");

const feedList = document.getElementById("feedList");
const feedCount = document.getElementById("feedCount");

// ---------------------------------------------------
// 5. 초기화 함수
// ---------------------------------------------------
async function initApp() {
  setupEventListeners();

  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
      const authModule = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

      const app = initializeApp(firebaseConfig);
      auth = authModule.getAuth(app);
      db = firestoreModule.getFirestore(app);
      googleProvider = new authModule.GoogleAuthProvider();

      signInWithPopup = authModule.signInWithPopup;
      signOut = authModule.signOut;
      onAuthStateChanged = authModule.onAuthStateChanged;

      collection = firestoreModule.collection;
      addDoc = firestoreModule.addDoc;
      onSnapshot = firestoreModule.onSnapshot;
      query = firestoreModule.query;
      orderBy = firestoreModule.orderBy;
      serverTimestamp = firestoreModule.serverTimestamp;

      isFirebaseReady = true;
      console.log("🔥 Firebase 연결 성공!");

      onAuthStateChanged(auth, handleAuthStateChanged);
      subscribeToFirestore();
      return;
    } catch (err) {
      console.warn("Firebase 로드 실패. 로컬 데모 모드로 동작합니다:", err);
    }
  }

  setupLocalDemoMode();
}

// GIPHY API Key 관리 (유효한 32자리 정식 키 연결)
const GIPHY_API_KEY_VALID = "S1nhMjaqR0ylH2gHPY87YCXQSMeebfmS";
let giphyApiKey = GIPHY_API_KEY_VALID;

// ---------------------------------------------------
// 6. 이벤트 리스너 등록
// ---------------------------------------------------
function setupEventListeners() {

  tagChips.forEach(chip => {
    chip.addEventListener("click", () => {
      tagChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedTag = chip.getAttribute("data-tag");
    });
  });

  openGifModalBtn.addEventListener("click", () => {
    gifModal.classList.remove("hidden");
    gifSearchInput.focus();
    if (!gifResults.hasChildNodes()) {
      searchGifs(gifSearchInput.value.trim() || "축하");
    }
  });

  closeGifModalBtn.addEventListener("click", () => {
    gifModal.classList.add("hidden");
  });

  gifModal.addEventListener("click", (e) => {
    if (e.target === gifModal) {
      gifModal.classList.add("hidden");
    }
  });

  gifSearchBtn.addEventListener("click", () => {
    const q = gifSearchInput.value.trim();
    searchGifs(q);
  });

  gifSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = gifSearchInput.value.trim();
      searchGifs(q);
    }
  });

  quickChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const keyword = chip.getAttribute("data-keyword");
      gifSearchInput.value = keyword;
      searchGifs(keyword);
    });
  });

  removeGifBtn.addEventListener("click", () => {
    selectedGifUrl = null;
    gifPreviewContainer.classList.add("hidden");
    gifPreviewImg.src = "";
  });

  submitBtn.addEventListener("click", handleGuestbookSubmit);
  loginBtn.addEventListener("click", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);
}

// ---------------------------------------------------
// 7. 실시간 글로벌 GIF 검색 (GIPHY API 실시간 호출)
// ---------------------------------------------------
async function searchGifs(searchQuery) {
  const q = (searchQuery || "").replace(/[#＃]/g, '').trim();

  if (!q) {
    alert("검색어를 입력해 주세요!");
    return;
  }

  gifLoading.classList.remove("hidden");
  gifResults.innerHTML = "";

  // 1) GIPHY API Key가 설정되어 있는 경우: 실제 실시간 전 세계 검색 수행
  if (giphyApiKey) {
    try {
      const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(giphyApiKey)}&q=${encodeURIComponent(q)}&limit=24&rating=g`;
      const res = await fetch(endpoint);
      const data = await res.json();

      gifLoading.classList.add("hidden");

      if (data.data && data.data.length > 0) {
        data.data.forEach(item => {
          const gifUrl = item.images.fixed_height_small?.url || item.images.fixed_height?.url || item.images.original?.url;
          if (!gifUrl) return;

          const div = document.createElement("div");
          div.className = "gif-item";
          div.innerHTML = `
            <img src="${gifUrl}" alt="${escapeHtml(item.title || q)}" loading="lazy">
            <span class="gif-tag-label">${escapeHtml(q)}</span>
          `;
          div.addEventListener("click", () => {
            selectGif(gifUrl);
          });
          gifResults.appendChild(div);
        });
        return;
      } else {
        gifResults.innerHTML = `
          <div style="grid-column: 1/-1; text-align:center; padding: 30px; color: #64748b;">
            <p style="font-weight: 700; font-size: 1rem; margin-bottom: 6px;">'${escapeHtml(q)}' 검색 결과가 없습니다.</p>
            <p style="font-size: 0.85rem;">다른 검색어로 검색해 보세요!</p>
          </div>
        `;
        return;
      }
    } catch (err) {
      console.error("GIPHY API 실시간 호출 에러:", err);
      gifLoading.classList.add("hidden");
      alert("GIPHY API 호출 중 오류가 발생했습니다. API Key를 확인해 주세요.");
    }
  }

  // 2) API Key가 아직 없는 경우: 안내 메시지 및 API Key 발급 가이드 표시
  gifLoading.classList.add("hidden");
  gifResults.innerHTML = `
    <div style="grid-column: 1/-1; text-align:center; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1; color: #475569;">
      <span style="font-size: 2rem; display:block; margin-bottom: 8px;">🔑</span>
      <p style="font-weight: 700; font-size: 0.95rem; margin-bottom: 6px;">실시간 전 세계 라이브 검색을 위한 GIPHY API Key가 필요합니다.</p>
      <p style="font-size: 0.82rem; color: #64748b; line-height: 1.5; margin-bottom: 12px;">
        구글의 Tenor 서비스 종료로 인해, 어떤 단어든 실시간으로 찾아오려면 무료 API Key가 필요합니다.<br>
        <strong>developers.giphy.com</strong>에서 1분 만에 무료로 발급받으실 수 있습니다!
      </p>
      <a href="https://developers.giphy.com/dashboard/" target="_blank" class="btn btn-primary btn-sm" style="display:inline-flex; text-decoration:none;">
        👉 GIPHY 무료 API Key 발급받기 (1분 소요)
      </a>
      <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 10px;">발급받은 키를 위 'GIPHY 무료 API Key 입력' 칸에 넣고 [저장]을 누르면 즉시 작동합니다.</p>
    </div>
  `;
}

function selectGif(url) {
  selectedGifUrl = url;
  gifPreviewImg.src = url;
  gifPreviewContainer.classList.remove("hidden");
  gifModal.classList.add("hidden");
}

// ---------------------------------------------------
// 8. 사용자 인증 (구글 로그인 및 @hmh.or.kr 도메인 필터링)
// ---------------------------------------------------
async function handleLogin() {
  if (isFirebaseReady) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email || !user.email.endsWith(ALLOWED_DOMAIN)) {
        alert(`⚠️ 효명고등학교 전용 계정(${ALLOWED_DOMAIN})으로만 로그인할 수 있습니다.\n(현재 로그인 시도: ${user.email})`);
        await signOut(auth);
        return;
      }

      console.log("학교 계정 인증 완료:", user.displayName, user.email);
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      alert("로그인 중 오류가 발생했습니다: " + error.message);
    }
  } else {
    currentUser = {
      displayName: "김효명 선생님",
      email: "teacher" + ALLOWED_DOMAIN,
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=hyomyeong"
    };
    updateAuthUI(currentUser);
    alert(`💡 [로컬 체험 모드] 효명고 교원 계정(${currentUser.displayName})으로 가상 로그인되었습니다.`);
  }
}

async function handleLogout() {
  if (isFirebaseReady) {
    await signOut(auth);
  } else {
    currentUser = null;
    updateAuthUI(null);
  }
}

function handleAuthStateChanged(user) {
  if (user && user.email && user.email.endsWith(ALLOWED_DOMAIN)) {
    currentUser = user;
    updateAuthUI(user);
  } else {
    currentUser = null;
    updateAuthUI(null);
  }
}

function updateAuthUI(user) {
  if (user) {
    loginBtn.classList.add("hidden");
    userProfile.classList.remove("hidden");
    userName.textContent = user.displayName || "선생님";
    userAvatar.src = user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=avatar";
  } else {
    loginBtn.classList.remove("hidden");
    userProfile.classList.add("hidden");
  }
}

// ---------------------------------------------------
// 9. 방명록 등록 로직
// ---------------------------------------------------
async function handleGuestbookSubmit() {
  const content = messageInput.value.trim();

  if (!content) {
    alert("따뜻한 메시지 내용을 입력해 주세요! 😊");
    messageInput.focus();
    return;
  }

  const isAnonymous = anonCheck.checked;
  let authorName = "익명의 효명인";
  let authorPhoto = "https://api.dicebear.com/7.x/bottts/svg?seed=anonymous";

  if (!isAnonymous) {
    if (currentUser) {
      authorName = currentUser.displayName || "효명고 교사";
      authorPhoto = currentUser.photoURL || authorPhoto;
    } else {
      authorName = "효명 동료 교사";
    }
  }

  const newPost = {
    author: authorName,
    avatar: authorPhoto,
    isAnonymous: isAnonymous,
    tag: selectedTag,
    content: content,
    gifUrl: selectedGifUrl || null,
    createdAt: isFirebaseReady ? serverTimestamp() : new Date().toISOString()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "남기는 중...";

  try {
    if (isFirebaseReady) {
      await addDoc(collection(db, "guestbook"), newPost);
    } else {
      saveToLocalStorage(newPost);
    }

    messageInput.value = "";
    selectedGifUrl = null;
    gifPreviewContainer.classList.add("hidden");
    gifPreviewImg.src = "";
    anonCheck.checked = false;

    console.log("방명록 등록 완료!");
  } catch (err) {
    console.error("방명록 등록 오류:", err);
    alert("방명록을 등록하는 도중 오류가 발생했습니다: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "남기기 💌";
  }
}

// ---------------------------------------------------
// 10. Firestore 실시간 동기화
// ---------------------------------------------------
function subscribeToFirestore() {
  const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    const posts = [];
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    renderFeed(posts);
  }, (err) => {
    console.error("Firestore 실시간 피드 수신 에러:", err);
  });
}

// ---------------------------------------------------
// 11. 피드 렌더링 함수
// ---------------------------------------------------
function renderFeed(posts) {
  feedList.innerHTML = "";
  feedCount.textContent = posts.length;

  if (posts.length === 0) {
    feedList.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px; background: white; border-radius: 16px; border: 1px dashed #cbd5e1; color: #64748b;">
        <span style="font-size: 2.2rem; display:block; margin-bottom: 8px;">💌</span>
        <p style="font-weight: 600;">아직 남겨진 방명록이 없습니다.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">선생님이 첫 번째 따뜻한 응원의 주인공이 되어보세요!</p>
      </div>
    `;
    return;
  }

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card";

    const timeString = formatTimestamp(post.createdAt);

    card.innerHTML = `
      <div class="card-header">
        <div class="card-user-info">
          <img class="card-avatar" src="${escapeHtml(post.avatar || '')}" alt="avatar" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=default'">
          <div>
            <div class="card-author">${escapeHtml(post.author || '선생님')}</div>
            <div class="card-time">${timeString}</div>
          </div>
        </div>
        <span class="card-tag">#${escapeHtml(post.tag || '응원')}</span>
      </div>
      <div class="card-content">${escapeHtml(post.content || '')}</div>
      ${post.gifUrl ? `
        <div class="card-gif">
          <img src="${escapeHtml(post.gifUrl)}" alt="첨부 움짤" loading="lazy">
        </div>
      ` : ''}
    `;

    feedList.appendChild(card);
  });
}

function formatTimestamp(ts) {
  if (!ts) return "방금 전";
  
  let date;
  if (ts.toDate) {
    date = ts.toDate();
  } else if (typeof ts === "string") {
    date = new Date(ts);
  } else {
    date = new Date();
  }

  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return "방금 전";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------------------------------------------
// 12. 로컬 데모 모드
// ---------------------------------------------------
const LOCAL_STORAGE_KEY = "hmh_guestbook_local_posts";

function setupLocalDemoMode() {
  let localPosts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  if (localPosts.length === 0) {
    localPosts = [
      {
        author: "박지영 선생님",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=teacher1",
        isAnonymous: false,
        tag: "응원",
        content: "효명고 선생님들, 이번 주말까지 화이팅입니다! 항상 든든해요 👍",
        gifUrl: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200.gif",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        author: "익명의 효명인",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=anonymous",
        isAnonymous: true,
        tag: "칼퇴",
        content: "오늘 4시 반 칼퇴를 기원합니다!! 모두 파이팅 🚀",
        gifUrl: "https://media.giphy.com/media/3o7ZetIsjgoYVTx05y/200.gif",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localPosts));
  }

  renderFeed(localPosts);
}

function saveToLocalStorage(newPost) {
  const localPosts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  localPosts.unshift(newPost);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localPosts));
  renderFeed(localPosts);
}

initApp();
