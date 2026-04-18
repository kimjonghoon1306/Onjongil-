/* ============================================================
   온종일 · portfolio.js  — 포트폴리오 CRUD + 썸네일 자동 추출
   ============================================================ */

const MAX_PORTFOLIO = 20;

/* ── 이모지 & 배경 팔레트 ── */
const EMOJI_PRESETS = ['🛒','🏠','🚀','🎨','📊','🤖','🐟','☕','🌱','🌸','💪','🍰','🍜','👕','💄','🐶','🏡','📚','🕯️','🧘','💡','⚡','🎯','🔥'];
const BG_PRESETS = [
  {label:'핑크',  val:'linear-gradient(135deg,#ec4899,#f43f5e)'},
  {label:'블루',  val:'linear-gradient(135deg,#3b82f6,#6366f1)'},
  {label:'그린',  val:'linear-gradient(135deg,#059669,#0f766e)'},
  {label:'오렌지',val:'linear-gradient(135deg,#f59e0b,#f97316)'},
  {label:'퍼플',  val:'linear-gradient(135deg,#8b5cf6,#6366f1)'},
  {label:'레드',  val:'linear-gradient(135deg,#ef4444,#dc2626)'},
  {label:'스카이',val:'linear-gradient(135deg,#0ea5e9,#0284c7)'},
  {label:'다크',  val:'linear-gradient(135deg,#1a2035,#2a3446)'},
  {label:'민트',  val:'linear-gradient(135deg,#34d399,#10b981)'},
  {label:'로즈',  val:'linear-gradient(135deg,#f472b6,#ec4899)'},
];

/* ── 기본 포트폴리오 ── */
const defaultPortfolio = [
  {id:1,  title:'영광 굴비가게',      category:'쇼핑몰',    desc:'전통 수산물 도매 쇼핑몰. AI 상세페이지 생성 기능 탑재.',    emoji:'🐟', bg:'linear-gradient(135deg,#0ea5e9,#0284c7)', img:'', link:''},
  {id:2,  title:'소담 카페 브랜딩',   category:'홈페이지',  desc:'감성 카페 브랜드 홈페이지 + 온라인 예약 시스템.',          emoji:'☕', bg:'linear-gradient(135deg,#8b5cf6,#6366f1)', img:'', link:''},
  {id:3,  title:'건강식품 랜딩',      category:'랜딩페이지',desc:'광고 전환율 3배 상승시킨 세일즈 랜딩페이지.',             emoji:'🌱', bg:'linear-gradient(135deg,#059669,#0f766e)', img:'', link:''},
  {id:4,  title:'꽃집 스마트스토어',  category:'쇼핑몰',    desc:'당일 배송 꽃집. 카테고리별 감성 디자인 적용.',             emoji:'🌸', bg:'linear-gradient(135deg,#ec4899,#f43f5e)', img:'', link:''},
  {id:5,  title:'식자재 도매전산',    category:'도매전산',  desc:'거래처 500곳 관리. 매출·재고·세금계산서 자동화.',          emoji:'📊', bg:'linear-gradient(135deg,#f59e0b,#f97316)', img:'', link:''},
  {id:6,  title:'헬스장 홈페이지',    category:'홈페이지',  desc:'PT 예약 시스템 + 회원 관리 대시보드 통합 제작.',           emoji:'💪', bg:'linear-gradient(135deg,#ef4444,#dc2626)', img:'', link:''},
  {id:7,  title:'수제 디저트 상세',   category:'디자인',    desc:'스토리텔링 중심의 고급 상세페이지 10종 세트.',             emoji:'🍰', bg:'linear-gradient(135deg,#f472b6,#ec4899)', img:'', link:''},
  {id:8,  title:'로컬 맛집 가이드',   category:'홈페이지',  desc:'지역 맛집 소개 + 지도 연동 리뷰 플랫폼.',                emoji:'🍜', bg:'linear-gradient(135deg,#fb923c,#f97316)', img:'', link:''},
  {id:9,  title:'의류 편집샵',        category:'쇼핑몰',    desc:'Z세대 타겟 의류 브랜드 자사몰. 모바일 최적화.',            emoji:'👕', bg:'linear-gradient(135deg,#1a2035,#2a3446)', img:'', link:''},
  {id:10, title:'뷰티 신제품 런칭',   category:'랜딩페이지',desc:'신제품 런칭 티저 페이지. 일 방문자 1만+ 달성.',           emoji:'💄', bg:'linear-gradient(135deg,#e11d48,#be123c)', img:'', link:''},
  {id:11, title:'반려동물 용품점',    category:'쇼핑몰',    desc:'구독형 사료 배송 서비스 포함 통합 쇼핑몰.',              emoji:'🐶', bg:'linear-gradient(135deg,#fbbf24,#f59e0b)', img:'', link:''},
  {id:12, title:'부동산 중개 플랫폼', category:'홈페이지',  desc:'지역 공인중개사 매물 관리 플랫폼 + 앱 연동.',            emoji:'🏠', bg:'linear-gradient(135deg,#14b8a6,#0d9488)', img:'', link:''},
  {id:13, title:'온라인 강의 플랫폼', category:'홈페이지',  desc:'영상 강의 + 결제 + 수강생 관리 올인원.',                emoji:'📚', bg:'linear-gradient(135deg,#6366f1,#8b5cf6)', img:'', link:''},
  {id:14, title:'수제 향초 브랜드',   category:'디자인',    desc:'인스타 광고용 상세페이지 + 브랜드 가이드.',              emoji:'🕯️',bg:'linear-gradient(135deg,#a78bfa,#8b5cf6)', img:'', link:''},
  {id:15, title:'요가 스튜디오',      category:'홈페이지',  desc:'클래스 예약 + 멤버십 관리 + 결제 통합.',                emoji:'🧘', bg:'linear-gradient(135deg,#34d399,#10b981)', img:'', link:''},
];

/* ── 스토리지 ── */
function loadPortfolio(){
  try {
    const saved = localStorage.getItem('onjongil-portfolio');
    if(saved) return JSON.parse(saved);
  } catch(e){}
  return defaultPortfolio;
}
function savePortfolioList(list){
  localStorage.setItem('onjongil-portfolio', JSON.stringify(list));
}

let portfolio = loadPortfolio();
let editingId = null;
let currentThumbMode = 'auto';

/* ================================================================
   렌더링
   ================================================================ */
function renderPortfolio(){
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = '';
  portfolio.forEach((p,i)=>{
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.style.animationDelay = (i*0.05)+'s';
    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const emojiFallback = `<div style="${p.img ? 'display:none' : 'display:flex'};font-size:64px;align-items:center;justify-content:center;width:100%;height:100%;position:absolute;inset:0">${p.emoji||'🎨'}</div>`;
    card.innerHTML = `
      <div class="portfolio-img" style="background:${p.bg||'linear-gradient(135deg,#ffd27a,#ff8a5c)'}">
        <span class="portfolio-category">${p.category}</span>
        ${imgHtml}${emojiFallback}
        <div class="portfolio-admin-buttons">
          <button class="mini-btn js-edit" title="수정">✏️</button>
          <button class="mini-btn delete js-delete" title="삭제">✕</button>
        </div>
      </div>
      <div class="portfolio-info">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        ${p.link ? `<a href="${p.link}" target="_blank" class="portfolio-link" onclick="event.stopPropagation()">자세히 보기 →</a>` : ''}
      </div>
    `;
    card.querySelector('.js-edit').addEventListener('click', e=>{
      e.stopPropagation(); editPortfolio(p.id);
    });
    card.querySelector('.js-delete').addEventListener('click', e=>{
      e.stopPropagation(); deletePortfolio(p.id);
    });
    grid.appendChild(card);
  });

  const addCard = document.createElement('button');
  const isFull = portfolio.length >= MAX_PORTFOLIO;
  addCard.className = 'portfolio-add-card' + (isFull?' full':'');
  if(isFull){
    addCard.innerHTML = `<div class="plus">!</div><span>등록 한도에 도달했습니다<br>(기존 항목을 삭제 후 추가)</span>`;
    addCard.onclick = ()=>alert(`포트폴리오 등록 한도에 도달했습니다.\n기존 항목을 삭제하고 추가해주세요!`);
  } else {
    addCard.innerHTML = `<div class="plus">+</div><span>새 포트폴리오 추가</span>`;
    addCard.onclick = ()=>openPfModal();
  }
  grid.appendChild(addCard);
}

/* ================================================================
   모달 열기 / 닫기
   ================================================================ */
function openPfModal(editData=null){
  editingId = editData ? editData.id : null;
  document.getElementById('pfModalTitle').textContent = editData ? '포트폴리오 수정' : '포트폴리오 추가';
  document.getElementById('pfTitle').value    = editData?.title    || '';
  document.getElementById('pfCategory').value = editData?.category || '쇼핑몰';
  document.getElementById('pfDesc').value     = editData?.desc     || '';

  const hasImg = !!(editData?.img);
  switchThumbTab(hasImg ? 'auto' : 'emoji');

  // auto 패널
  document.getElementById('pfLink').value    = editData?.link || '';
  document.getElementById('pfImg').value     = editData?.img  || '';
  document.getElementById('pfImgAuto').value = '';
  resetThumbUI();
  if(editData?.img) showThumbPreview(editData.img, '🖼 저장된 이미지');

  // emoji 패널
  document.getElementById('pfLinkEmoji').value = editData?.link  || '';
  document.getElementById('pfEmoji').value     = editData?.emoji || '🎨';
  const bgVal = editData?.bg || BG_PRESETS[0].val;
  document.getElementById('pfBg').value = bgVal;
  syncBgGrid();

  document.getElementById('pfModal').classList.add('active');
}

function closePfModal(){
  document.getElementById('pfModal').classList.remove('active');
  editingId = null;
}

/* ================================================================
   탭 전환
   ================================================================ */
function switchThumbTab(mode){
  currentThumbMode = mode;
  document.getElementById('tabAuto').classList.toggle('active', mode==='auto');
  document.getElementById('tabEmoji').classList.toggle('active', mode==='emoji');
  document.getElementById('panelAuto').style.display  = mode==='auto'  ? '' : 'none';
  document.getElementById('panelEmoji').style.display = mode==='emoji' ? '' : 'none';
}

/* ================================================================
   썸네일 자동 추출
   ================================================================ */
function onLinkInput(){
  document.getElementById('pfImg').value = '';
  resetThumbUI();
}

function resetThumbUI(){
  document.getElementById('thumbPreviewWrap').style.display = 'none';
  document.getElementById('thumbLoading').style.display     = 'none';
  document.getElementById('thumbError').style.display       = 'none';
}

function resetThumbnail(){
  document.getElementById('pfImg').value = '';
  resetThumbUI();
}

function showThumbLoading(text){
  document.getElementById('thumbPreviewWrap').style.display = 'none';
  document.getElementById('thumbError').style.display       = 'none';
  document.getElementById('thumbLoadingText').textContent   = text;
  document.getElementById('thumbLoading').style.display     = 'flex';
}

function showThumbPreview(imgUrl, badge){
  document.getElementById('thumbLoading').style.display     = 'none';
  document.getElementById('thumbError').style.display       = 'none';
  document.getElementById('pfImg').value                    = imgUrl;
  document.getElementById('thumbSourceBadge').textContent   = badge;
  document.getElementById('thumbPreview').innerHTML =
    `<img src="${imgUrl}" alt="미리보기" onerror="onThumbImgError()">`;
  document.getElementById('thumbPreviewWrap').style.display = '';
}

function showThumbError(){
  document.getElementById('thumbLoading').style.display     = 'none';
  document.getElementById('thumbPreviewWrap').style.display = 'none';
  document.getElementById('thumbError').style.display       = '';
}

function onManualImgInput(){
  const val = document.getElementById('pfImgAuto').value.trim();
  document.getElementById('pfImg').value = val;
  if(val) showThumbPreview(val, '🔗 직접 입력');
  else resetThumbUI();
}

function onThumbImgError(){
  document.getElementById('pfImg').value = '';
  showThumbError();
}

async function fetchThumbnail(){
  const raw = document.getElementById('pfLink').value.trim();
  if(!raw){ alert('URL을 먼저 입력해주세요.'); return; }
  let url = raw;
  if(!/^https?:\/\//i.test(url)) url = 'https://' + url;
  document.getElementById('pfLink').value = url;

  showThumbLoading('썸네일 가져오는 중...');
  try {
    const res = await fetch(`/api/thumbnail?url=${encodeURIComponent(url)}`);
    if(res.ok){
      const data = await res.json();
      if(data.imgUrl){
        showThumbPreview(data.imgUrl, data.type === 'og' ? '🖼 OG 이미지' : '📸 스크린샷');
        return;
      }
    }
  } catch(e){}
  showThumbError();
}

function parseOgImage(html){
  const patterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
  ];
  for(const re of patterns){
    const m = html.match(re);
    if(m && m[1] && m[1].startsWith('http')) return m[1];
  }
  return null;
}

/* ================================================================
   이모지 & 배경 UI
   ================================================================ */
function buildEmojiGrid(){
  const grid = document.getElementById('emojiGrid');
  if(!grid) return;
  grid.innerHTML = EMOJI_PRESETS.map(e =>
    `<button type="button" class="emoji-preset-btn" onclick="selectEmoji('${e}')">${e}</button>`
  ).join('');
}

function buildBgGrid(){
  const grid = document.getElementById('bgGrid');
  if(!grid) return;
  grid.innerHTML = BG_PRESETS.map((b,i) =>
    `<button type="button" class="bg-preset-btn" id="bgBtn_${i}" style="background:${b.val}" title="${b.label}" onclick="selectBg('${b.val}',${i})"></button>`
  ).join('');
}

function selectEmoji(e){
  document.getElementById('pfEmoji').value = e;
}

function selectBg(val, idx){
  document.getElementById('pfBg').value = val;
  syncBgGrid(idx);
}

function syncBgGrid(activeIdx){
  if(activeIdx === undefined){
    const cur = document.getElementById('pfBg')?.value || '';
    activeIdx = BG_PRESETS.findIndex(b=>b.val===cur);
  }
  BG_PRESETS.forEach((_,i)=>{
    const btn = document.getElementById(`bgBtn_${i}`);
    if(btn) btn.classList.toggle('active', i===activeIdx);
  });
}

/* ================================================================
   저장
   ================================================================ */
function savePortfolio(){
  const title    = document.getElementById('pfTitle').value.trim();
  const category = document.getElementById('pfCategory').value;
  const desc     = document.getElementById('pfDesc').value.trim();
  if(!title || !desc){ alert('제목과 설명은 필수입니다!'); return; }

  let img='', link='', emoji='🎨', bg=BG_PRESETS[0].val;

  if(currentThumbMode === 'auto'){
    img  = document.getElementById('pfImg').value.trim();
    link = document.getElementById('pfLink').value.trim();
    if(link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
    emoji= '🎨';
    bg   = 'linear-gradient(135deg,#1a2035,#2a3446)';
  } else {
    link  = document.getElementById('pfLinkEmoji').value.trim();
    if(link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
    emoji = document.getElementById('pfEmoji').value.trim() || '🎨';
    bg    = document.getElementById('pfBg').value || BG_PRESETS[0].val;
    img   = '';
  }

  const item = {img, link, emoji, bg, title, category, desc};
  if(editingId !== null && editingId !== undefined){
    const idx = portfolio.findIndex(p => p.id == editingId);
    if(idx >= 0) portfolio[idx] = {...portfolio[idx], ...item};
    else { alert('수정할 항목을 찾을 수 없어요. 새로고침 후 다시 시도해주세요.'); return; }
  } else {
    if(portfolio.length >= MAX_PORTFOLIO){ alert('등록 한도에 도달했습니다!'); return; }
    item.id = Date.now();
    portfolio.push(item);
  }
  savePortfolioList(portfolio);
  closePfModal();
  renderPortfolio();
}

/* ================================================================
   수정 / 삭제
   ================================================================ */
function editPortfolio(id){
  const p = portfolio.find(x => x.id == id);
  if(p) openPfModal(p);
  else alert('항목을 찾을 수 없어요.');
}

function deletePortfolio(id){
  if(!confirm('정말 삭제할까요?')) return;
  portfolio = portfolio.filter(x => x.id != id);
  savePortfolioList(portfolio);
  renderPortfolio();
}

/* 초기화 */
document.addEventListener('DOMContentLoaded', ()=>{
  buildEmojiGrid();
  buildBgGrid();
});
