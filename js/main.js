/* ============================================================
   온종일 · main.js
   ============================================================ */

/* ── 별빛 생성 ── */
const stars = document.getElementById('stars');
for(let i=0;i<80;i++){
  const s=document.createElement('div');
  s.className='star';
  s.style.left=Math.random()*100+'%';
  s.style.top=Math.random()*70+'%';
  s.style.animationDelay=Math.random()*3+'s';
  s.style.opacity=Math.random()*0.8+0.2;
  stars.appendChild(s);
}

/* ── 구름 생성 ── */
const clouds = document.getElementById('clouds');
const cloudData=[
  {top:'10%',size:80,delay:0,dur:40},
  {top:'25%',size:120,delay:8,dur:50},
  {top:'45%',size:60,delay:15,dur:35},
  {top:'65%',size:100,delay:3,dur:45},
];
cloudData.forEach(c=>{
  const el=document.createElement('div');
  el.className='cloud';
  el.style.top=c.top;
  el.style.width=c.size+'px';
  el.style.height=c.size*0.4+'px';
  el.style.animationDelay=-c.delay+'s';
  el.style.animationDuration=c.dur+'s';
  clouds.appendChild(el);
});

/* ── 테마 토글 ── */
const themeToggle = document.getElementById('themeToggle');
const themeBall = document.getElementById('themeBall');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  themeBall.textContent = t==='night' ? '🌙' : '☀️';
  localStorage.setItem('onjongil-theme', t);
}
themeToggle.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur==='night' ? 'day' : 'night');
});
applyTheme(localStorage.getItem('onjongil-theme') || 'night');

/* ── 모바일 메뉴 ── */
document.getElementById('mobileToggle').addEventListener('click',()=>{
  document.getElementById('navMenu').classList.toggle('mobile-open');
});

/* ── 스크롤 리빌 ── */
const observer = new IntersectionObserver(es=>{
  es.forEach(e=>e.isIntersecting && e.target.classList.add('visible'));
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ── 숫자 카운트업 ── */
const statObs = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      const target=+el.dataset.target;
      const dur=1500;
      const start=Date.now();
      const tick=()=>{
        const p=Math.min((Date.now()-start)/dur,1);
        el.textContent=Math.floor(target*p*(2-p));
        if(p<1) requestAnimationFrame(tick);
        else el.textContent=target;
      };
      tick();
      statObs.unobserve(el);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.stat-num').forEach(el=>statObs.observe(el));

/* ── 캐릭터 클릭 인터랙션 ── */
document.querySelector('.character').addEventListener('click', function(){
  const bubble = document.querySelector('.speech-bubble');
  const messages = [
    '제가 다 해드릴게요!',
    '문의 환영합니다!',
    '24시간 대기중!',
    '함께해요 사장님!',
    '오늘도 파이팅!',
  ];
  const msg = messages[Math.floor(Math.random()*messages.length)];
  bubble.querySelector('.hand').textContent = msg;
  bubble.style.animation = 'none';
  setTimeout(()=>{bubble.style.animation = 'bubble-pop 4s infinite';}, 10);
});

/* ── 모달 외부 클릭 닫기 ── */
document.getElementById('pfModal').addEventListener('click', e=>{
  if(e.target.id==='pfModal') closePfModal();
});
document.getElementById('pwModal').addEventListener('click', e=>{
  if(e.target.id==='pwModal') closePwModal();
});
document.getElementById('pwChangeModal').addEventListener('click', e=>{
  if(e.target.id==='pwChangeModal') closePwChangeModal();
});

// 초기 렌더
renderPortfolio();
