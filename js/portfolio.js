/* ============================================================
   온종일 · portfolio.js — Firestore 연동 + Cloudinary 이미지 업로드
   ============================================================ */
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from './firebase-config.js';

const CLOUDINARY_CLOUD  = 'djzvtfso0';
const CLOUDINARY_PRESET = 'onjongil';
const COLLECTION        = 'portfolios';
const MAX_PORTFOLIO     = 100;

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

const defaultPortfolio = [
  {title:'영광 굴비가게',      category:'쇼핑몰',    desc:'전통 수산물 도매 쇼핑몰. AI 상세페이지 생성 기능 탑재.',  emoji:'🐟', bg:'linear-gradient(135deg,#0ea5e9,#0284c7)', img:'', link:'', order:1},
  {title:'소담 카페 브랜딩',   category:'홈페이지',  desc:'감성 카페 브랜드 홈페이지 + 온라인 예약 시스템.',        emoji:'☕', bg:'linear-gradient(135deg,#8b5cf6,#6366f1)', img:'', link:'', order:2},
  {title:'건강식품 랜딩',      category:'랜딩페이지',desc:'광고 전환율 3배 상승시킨 세일즈 랜딩페이지.',           emoji:'🌱', bg:'linear-gradient(135deg,#059669,#0f766e)', img:'', link:'', order:3},
  {title:'꽃집 스마트스토어',  category:'쇼핑몰',    desc:'당일 배송 꽃집. 카테고리별 감성 디자인 적용.',           emoji:'🌸', bg:'linear-gradient(135deg,#ec4899,#f43f5e)', img:'', link:'', order:4},
  {title:'식자재 도매전산',    category:'도매전산',  desc:'거래처 500곳 관리. 매출·재고·세금계산서 자동화.',        emoji:'📊', bg:'linear-gradient(135deg,#f59e0b,#f97316)', img:'', link:'', order:5},
  {title:'헬스장 홈페이지',    category:'홈페이지',  desc:'PT 예약 시스템 + 회원 관리 대시보드 통합 제작.',         emoji:'💪', bg:'linear-gradient(135deg,#ef4444,#dc2626)', img:'', link:'', order:6},
  {title:'수제 디저트 상세',   category:'디자인',    desc:'스토리텔링 중심의 고급 상세페이지 10종 세트.',           emoji:'🍰', bg:'linear-gradient(135deg,#f472b6,#ec4899)', img:'', link:'', order:7},
  {title:'로컬 맛집 가이드',   category:'홈페이지',  desc:'지역 맛집 소개 + 지도 연동 리뷰 플랫폼.',              emoji:'🍜', bg:'linear-gradient(135deg,#fb923c,#f97316)', img:'', link:'', order:8},
  {title:'의류 편집샵',        category:'쇼핑몰',    desc:'Z세대 타겟 의류 브랜드 자사몰. 모바일 최적화.',          emoji:'👕', bg:'linear-gradient(135deg,#1a2035,#2a3446)', img:'', link:'', order:9},
  {title:'뷰티 신제품 런칭',   category:'랜딩페이지',desc:'신제품 런칭 티저 페이지. 일 방문자 1만+ 달성.',         emoji:'💄', bg:'linear-gradient(135deg,#e11d48,#be123c)', img:'', link:'', order:10},
  {title:'반려동물 용품점',    category:'쇼핑몰',    desc:'구독형 사료 배송 서비스 포함 통합 쇼핑몰.',            emoji:'🐶', bg:'linear-gradient(135deg,#fbbf24,#f59e0b)', img:'', link:'', order:11},
  {title:'부동산 중개 플랫폼', category:'홈페이지',  desc:'지역 공인중개사 매물 관리 플랫폼 + 앱 연동.',          emoji:'🏠', bg:'linear-gradient(135deg,#14b8a6,#0d9488)', img:'', link:'', order:12},
  {title:'온라인 강의 플랫폼', category:'홈페이지',  desc:'영상 강의 + 결제 + 수강생 관리 올인원.',              emoji:'📚', bg:'linear-gradient(135deg,#6366f1,#8b5cf6)', img:'', link:'', order:13},
  {title:'수제 향초 브랜드',   category:'디자인',    desc:'인스타 광고용 상세페이지 + 브랜드 가이드.',            emoji:'🕯️',bg:'linear-gradient(135deg,#a78bfa,#8b5cf6)', img:'', link:'', order:14},
  {title:'요가 스튜디오',      category:'홈페이지',  desc:'클래스 예약 + 멤버십 관리 + 결제 통합.',              emoji:'🧘', bg:'linear-gradient(135deg,#34d399,#10b981)', img:'', link:'', order:15},
];

let portfolio     = [];
let editingId     = null;
let currentThumbMode = 'auto';

/* ================================================================
   Firestore CRUD
   ================================================================ */
async function loadPortfolio(){
  try {
    const q   = query(collection(db, COLLECTION), orderBy('order','asc'));
    const snap = await getDocs(q);
    if(snap.empty){
      // 첫 실행 — 기본 데이터 일괄 삽입
      for(const item of defaultPortfolio){
        await addDoc(collection(db, COLLECTION), item);
      }
      return loadPortfolio();
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e){
    console.error(e);
    return [];
  }
}

async function fsAdd(item){
  const snap = await getDocs(collection(db, COLLECTION));
  item.order = snap.size + 1;
  const ref = await addDoc(collection(db, COLLECTION), item);
  return ref.id;
}

async function fsUpdate(id, item){
  await updateDoc(doc(db, COLLECTION, id), item);
}

async function fsDelete(id){
  await deleteDoc(doc(db, COLLECTION, id));
}

/* ================================================================
   렌더링
   ================================================================ */
async function renderPortfolio(){
  const grid = document.getElementById('portfolioGrid');
  if(!grid) return;
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">불러오는 중...</div>';

  portfolio = await loadPortfolio();
  grid.innerHTML = '';

  portfolio.forEach((p,i)=>{
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.style.animationDelay = (i*0.05)+'s';
    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const emojiFallback = `<div style="${p.img?'display:none':'display:flex'};font-size:64px;align-items:center;justify-content:center;width:100%;height:100%;position:absolute;inset:0">${p.emoji||'🎨'}</div>`;
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
    card.querySelector('.js-edit').addEventListener('click', e=>{ e.stopPropagation(); openPfModal(p); });
    card.querySelector('.js-delete').addEventListener('click', e=>{ e.stopPropagation(); deletePortfolio(p.id); });
    grid.appendChild(card);
  });

  const addCard = document.createElement('button');
  const isFull  = portfolio.length >= MAX_PORTFOLIO;
  addCard.className = 'portfolio-add-card' + (isFull?' full':'');
  if(isFull){
    addCard.innerHTML = `<div class="plus">!</div><span>등록 한도(100개)에 도달했습니다</span>`;
    addCard.onclick   = ()=>alert('기존 항목을 삭제 후 추가해주세요!');
  } else {
    addCard.innerHTML = `<div class="plus">+</div><span>새 포트폴리오 추가</span>`;
    addCard.onclick   = ()=>openPfModal();
  }
  grid.appendChild(addCard);
}

/* ================================================================
   모달
   ================================================================ */
function openPfModal(editData=null){
  editingId = editData ? editData.id : null;
  document.getElementById('pfModalTitle').textContent = editData ? '포트폴리오 수정' : '포트폴리오 추가';
  document.getElementById('pfTitle').value    = editData?.title    || '';
  document.getElementById('pfCategory').value = editData?.category || '쇼핑몰';
  document.getElementById('pfDesc').value     = editData?.desc     || '';

  switchThumbTab(editData?.img ? 'auto' : 'emoji');

  document.getElementById('pfLink').value = editData?.link || '';
  document.getElementById('pfImg').value  = editData?.img  || '';
  const f = document.getElementById('pfFile');
  if(f) f.value = '';
  resetThumbUI();
  if(editData?.img) showThumbPreview(editData.img, '🖼 저장된 이미지');

  document.getElementById('pfLinkEmoji').value = editData?.link  || '';
  document.getElementById('pfEmoji').value     = editData?.emoji || '🎨';
  document.getElementById('pfBg').value        = editData?.bg    || BG_PRESETS[0].val;
  syncBgGrid();

  document.getElementById('pfModal').classList.add('active');
}

window.closePfModal = function(){
  document.getElementById('pfModal').classList.remove('active');
  editingId = null;
};

function switchThumbTab(mode){
  currentThumbMode = mode;
  document.getElementById('tabAuto').classList.toggle('active', mode==='auto');
  document.getElementById('tabEmoji').classList.toggle('active', mode==='emoji');
  document.getElementById('panelAuto').style.display  = mode==='auto'  ? '' : 'none';
  document.getElementById('panelEmoji').style.display = mode==='emoji' ? '' : 'none';
}
window.switchThumbTab = switchThumbTab;

/* ================================================================
   썸네일 UI
   ================================================================ */
function resetThumbUI(){
  document.getElementById('thumbPreviewWrap').style.display = 'none';
  document.getElementById('thumbLoading').style.display     = 'none';
  document.getElementById('thumbError').style.display       = 'none';
  document.getElementById('pfImg').value = '';
}
window.resetThumbUI = resetThumbUI;

window.resetThumbnail = function(){
  resetThumbUI();
  const f = document.getElementById('pfFile');
  if(f) f.value = '';
};

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
  document.getElementById('thumbPreview').innerHTML         =
    `<img src="${imgUrl}" alt="미리보기">`;
  document.getElementById('thumbPreviewWrap').style.display = '';
}

function showThumbError(msg){
  document.getElementById('thumbLoading').style.display     = 'none';
  document.getElementById('thumbPreviewWrap').style.display = 'none';
  const el = document.getElementById('thumbError');
  el.textContent   = '😅 ' + (msg||'이미지를 불러오지 못했어요.');
  el.style.display = '';
}
window.showThumbError = showThumbError;

window.onLinkInput = function(){ resetThumbUI(); };

/* ================================================================
   Cloudinary 업로드
   ================================================================ */
window.onFileUpload = function(event){
  const file = event.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){ alert('이미지 파일만 가능합니다!'); return; }
  if(file.size > 10*1024*1024){ alert('10MB 이하만 가능합니다!'); return; }
  showThumbLoading('Cloudinary 업로드 중...');
  uploadToCloudinary(file);
};

async function uploadToCloudinary(file){
  try {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:'POST', body:fd });
    if(!res.ok) throw new Error('업로드 실패 ' + res.status);
    const data = await res.json();
    if(data.secure_url) showThumbPreview(data.secure_url, '☁️ Cloudinary');
    else throw new Error('URL 없음');
  } catch(e){
    showThumbError('업로드 실패: ' + e.message);
    document.getElementById('pfFile').value = '';
  }
}

/* ================================================================
   이모지 & 배경
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

window.selectEmoji = e => { document.getElementById('pfEmoji').value = e; };
window.selectBg    = (val, idx) => {
  document.getElementById('pfBg').value = val;
  syncBgGrid(idx);
};

function syncBgGrid(activeIdx){
  if(activeIdx===undefined){
    const cur = document.getElementById('pfBg')?.value||'';
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
window.savePortfolio = async function(){
  const title    = document.getElementById('pfTitle').value.trim();
  const category = document.getElementById('pfCategory').value;
  const desc     = document.getElementById('pfDesc').value.trim();
  if(!title||!desc){ alert('제목과 설명은 필수입니다!'); return; }

  const loadingEl = document.getElementById('thumbLoading');
  if(loadingEl && loadingEl.style.display!=='none'){
    alert('이미지 업로드가 완료될 때까지 기다려주세요!'); return;
  }

  let img='', link='', emoji='🎨', bg=BG_PRESETS[0].val;

  if(currentThumbMode==='auto'){
    img  = document.getElementById('pfImg').value.trim();
    link = document.getElementById('pfLink').value.trim();
    if(link && !/^https?:\/\//i.test(link)) link='https://'+link;
    emoji='🎨'; bg='linear-gradient(135deg,#1a2035,#2a3446)';
  } else {
    link  = document.getElementById('pfLinkEmoji').value.trim();
    if(link && !/^https?:\/\//i.test(link)) link='https://'+link;
    emoji = document.getElementById('pfEmoji').value.trim()||'🎨';
    bg    = document.getElementById('pfBg').value||BG_PRESETS[0].val;
    img   = '';
  }

  const item = { title, category, desc, img, link, emoji, bg };

  try {
    if(editingId){
      await fsUpdate(editingId, item);
    } else {
      if(portfolio.length>=MAX_PORTFOLIO){ alert('등록 한도(100개)에 도달했습니다!'); return; }
      await fsAdd(item);
    }
    closePfModal();
    await renderPortfolio();
  } catch(e){
    alert('저장 실패: ' + e.message);
  }
};

/* ================================================================
   삭제
   ================================================================ */
async function deletePortfolio(id){
  if(!confirm('정말 삭제할까요?')) return;
  try {
    await fsDelete(id);
    await renderPortfolio();
  } catch(e){
    alert('삭제 실패: ' + e.message);
  }
}

/* ================================================================
   초기화
   ================================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  buildEmojiGrid();
  buildBgGrid();
  renderPortfolio();
});
