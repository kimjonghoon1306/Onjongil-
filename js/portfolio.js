/* ============================================================
   온종일 · portfolio.js  — 포트폴리오 CRUD + 렌더링
   ============================================================ */

const MAX_PORTFOLIO = 20;

const defaultPortfolio = [
  {id:1,  title:'영광 굴비가게',        category:'쇼핑몰',    desc:'전통 수산물 도매 쇼핑몰. AI 상세페이지 생성 기능 탑재.',           emoji:'🐟', bg:'linear-gradient(135deg,#0ea5e9,#0284c7)', img:'', link:''},
  {id:2,  title:'소담 카페 브랜딩',     category:'홈페이지',  desc:'감성 카페 브랜드 홈페이지 + 온라인 예약 시스템.',               emoji:'☕', bg:'linear-gradient(135deg,#8b5cf6,#6366f1)', img:'', link:''},
  {id:3,  title:'건강식품 랜딩',        category:'랜딩페이지', desc:'광고 전환율 3배 상승시킨 세일즈 랜딩페이지.',                 emoji:'🌱', bg:'linear-gradient(135deg,#059669,#0f766e)', img:'', link:''},
  {id:4,  title:'꽃집 스마트스토어',    category:'쇼핑몰',    desc:'당일 배송 꽃집. 카테고리별 감성 디자인 적용.',                  emoji:'🌸', bg:'linear-gradient(135deg,#ec4899,#f43f5e)', img:'', link:''},
  {id:5,  title:'식자재 도매전산',      category:'도매전산',  desc:'거래처 500곳 관리. 매출·재고·세금계산서 자동화.',               emoji:'📊', bg:'linear-gradient(135deg,#f59e0b,#f97316)', img:'', link:''},
  {id:6,  title:'헬스장 홈페이지',      category:'홈페이지',  desc:'PT 예약 시스템 + 회원 관리 대시보드 통합 제작.',               emoji:'💪', bg:'linear-gradient(135deg,#ef4444,#dc2626)', img:'', link:''},
  {id:7,  title:'수제 디저트 상세',     category:'디자인',    desc:'스토리텔링 중심의 고급 상세페이지 10종 세트.',                  emoji:'🍰', bg:'linear-gradient(135deg,#f472b6,#ec4899)', img:'', link:''},
  {id:8,  title:'로컬 맛집 가이드',     category:'홈페이지',  desc:'지역 맛집 소개 + 지도 연동 리뷰 플랫폼.',                     emoji:'🍜', bg:'linear-gradient(135deg,#fb923c,#f97316)', img:'', link:''},
  {id:9,  title:'의류 편집샵',          category:'쇼핑몰',    desc:'Z세대 타겟 의류 브랜드 자사몰. 모바일 최적화.',                 emoji:'👕', bg:'linear-gradient(135deg,#1a2035,#2a3446)', img:'', link:''},
  {id:10, title:'뷰티 신제품 런칭',     category:'랜딩페이지', desc:'신제품 런칭 티저 페이지. 일 방문자 1만+ 달성.',               emoji:'💄', bg:'linear-gradient(135deg,#e11d48,#be123c)', img:'', link:''},
  {id:11, title:'반려동물 용품점',      category:'쇼핑몰',    desc:'구독형 사료 배송 서비스 포함 통합 쇼핑몰.',                   emoji:'🐶', bg:'linear-gradient(135deg,#fbbf24,#f59e0b)', img:'', link:''},
  {id:12, title:'부동산 중개 플랫폼',   category:'홈페이지',  desc:'지역 공인중개사 매물 관리 플랫폼 + 앱 연동.',                  emoji:'🏠', bg:'linear-gradient(135deg,#14b8a6,#0d9488)', img:'', link:''},
  {id:13, title:'온라인 강의 플랫폼',   category:'홈페이지',  desc:'영상 강의 + 결제 + 수강생 관리 올인원.',                      emoji:'📚', bg:'linear-gradient(135deg,#6366f1,#8b5cf6)', img:'', link:''},
  {id:14, title:'수제 향초 브랜드',     category:'디자인',    desc:'인스타 광고용 상세페이지 + 브랜드 가이드.',                   emoji:'🕯️', bg:'linear-gradient(135deg,#a78bfa,#8b5cf6)', img:'', link:''},
  {id:15, title:'요가 스튜디오',        category:'홈페이지',  desc:'클래스 예약 + 멤버십 관리 + 결제 통합.',                      emoji:'🧘', bg:'linear-gradient(135deg,#34d399,#10b981)', img:'', link:''},
];

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

function renderPortfolio(){
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = '';
  portfolio.forEach((p,i)=>{
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.style.animationDelay = (i*0.05)+'s';
    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.title}" onerror="this.parentElement.innerHTML='<div style=\\'font-size:64px\\'>${p.emoji||'🎨'}</div>'">`
      : `<div style="font-size:64px">${p.emoji||'🎨'}</div>`;
    card.innerHTML = `
      <div class="portfolio-img" style="background:${p.bg||'linear-gradient(135deg,#ffd27a,#ff8a5c)'}">
        <span class="portfolio-category">${p.category}</span>
        ${imgHtml}
        <div class="portfolio-admin-buttons">
          <button class="mini-btn" onclick="editPortfolio(${p.id});event.stopPropagation()" title="수정">✏️</button>
          <button class="mini-btn delete" onclick="deletePortfolio(${p.id});event.stopPropagation()" title="삭제">✕</button>
        </div>
      </div>
      <div class="portfolio-info">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        ${p.link ? `<a href="${p.link}" target="_blank" class="portfolio-link" onclick="event.stopPropagation()">자세히 보기 →</a>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });

  // 추가 카드
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

function openPfModal(editData=null){
  editingId = editData ? editData.id : null;
  document.getElementById('pfModalTitle').textContent = editData ? '포트폴리오 수정' : '포트폴리오 추가';
  document.getElementById('pfTitle').value    = editData?.title    || '';
  document.getElementById('pfCategory').value = editData?.category || '쇼핑몰';
  document.getElementById('pfDesc').value     = editData?.desc     || '';
  document.getElementById('pfImg').value      = editData?.img      || '';
  document.getElementById('pfEmoji').value    = editData?.emoji    || '🎨';
  document.getElementById('pfBg').value       = editData?.bg       || 'linear-gradient(135deg,#ec4899,#f43f5e)';
  document.getElementById('pfLink').value     = editData?.link     || '';
  document.getElementById('pfModal').classList.add('active');
}

function closePfModal(){
  document.getElementById('pfModal').classList.remove('active');
  editingId = null;
}

function savePortfolio(){
  const title    = document.getElementById('pfTitle').value.trim();
  const category = document.getElementById('pfCategory').value;
  const desc     = document.getElementById('pfDesc').value.trim();
  const img      = document.getElementById('pfImg').value.trim();
  const emoji    = document.getElementById('pfEmoji').value.trim() || '🎨';
  const bg       = document.getElementById('pfBg').value;
  const link     = document.getElementById('pfLink').value.trim();

  if(!title || !desc){ alert('제목과 설명은 필수입니다!'); return; }

  if(editingId){
    const idx = portfolio.findIndex(p=>p.id===editingId);
    if(idx>=0) portfolio[idx] = {id:editingId, title, category, desc, img, emoji, bg, link};
  } else {
    if(portfolio.length >= MAX_PORTFOLIO){ alert(`등록 한도에 도달했습니다!`); return; }
    const newId = Math.max(0, ...portfolio.map(p=>p.id)) + 1;
    portfolio.push({id:newId, title, category, desc, img, emoji, bg, link});
  }
  savePortfolioList(portfolio);
  closePfModal();
  renderPortfolio();
}

function editPortfolio(id){
  const p = portfolio.find(x=>x.id===id);
  if(p) openPfModal(p);
}

function deletePortfolio(id){
  if(!confirm('정말 삭제할까요?')) return;
  portfolio = portfolio.filter(x=>x.id!==id);
  savePortfolioList(portfolio);
  renderPortfolio();
}
