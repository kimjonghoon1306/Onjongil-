/* ============================================================
   온종일 · portfolio.js  — Supabase 연동 버전
   ============================================================ */

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

let portfolio = [];
let editingId = null;
let currentThumbMode = 'auto';
let uploadedImageFile = null;

async function loadPortfolio(){
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });
  if(error){ console.error(error); return []; }
  return data.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    desc: p.description,
    img: p.image_url || '',
    emoji: p.emoji || '🎨',
    bg: p.bg_gradient || BG_PRESETS[0].val,
    link: p.link_url || ''
  }));
}

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
  addCard.className = 'portfolio-add-card';
  addCard.innerHTML = `<div class="plus">+</div><span>새 포트폴리오 추가</span>`;
  addCard.onclick = ()=>openPfModal();
  grid.appendChild(addCard);
}

function openPfModal(editData=null){
  editingId = editData ? editData.id : null;
  uploadedImageFile = null;
  document.getElementById('pfModalTitle').textContent = editData ? '포트폴리오 수정' : '포트폴리오 추가';
  document.getElementById('pfTitle').value    = editData?.title    || '';
  document.getElementById('pfCategory').value = editData?.category || '쇼핑몰';
  document.getElementById('pfDesc').value     = editData?.desc     || '';

  const hasImg = !!(editData?.img);
  switchThumbTab(hasImg || !editData ? 'auto' : 'emoji');

  document.getElementById('pfLink').value = editData?.link || '';
  document.getElementById('pfImg').value  = editData?.img  || '';
  if(document.getElementById('pfFile')) document.getElementById('pfFile').value = '';
  resetThumbUI();
  if(editData?.img) showThumbPreview(editData.img, '🖼 저장된 이미지');

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
  uploadedImageFile = null;
}

function switchThumbTab(mode){
  currentThumbMode = mode;
  document.getElementById('tabAuto').classList.toggle('active', mode==='auto');
  document.getElementById('tabEmoji').classList.toggle('active', mode==='emoji');
  document.getElementById('panelAuto').style.display  = mode==='auto'  ? '' : 'none';
  document.getElementById('panelEmoji').style.display = mode==='emoji' ? '' : 'none';
}

function onLinkInput(){}
function resetThumbUI(){
  document.getElementById('thumbPreviewWrap').style.display = 'none';
  document.getElementById('thumbLoading').style.display     = 'none';
  document.getElementById('thumbError').style.display       = 'none';
}
function resetThumbnail(){
  document.getElementById('pfImg').value = '';
  uploadedImageFile = null;
  if(document.getElementById('pfFile')) document.getElementById('pfFile').value = '';
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
  document.getElementById('thumbSourceBadge').textContent   = badge;
  document.getElementById('thumbPreview').innerHTML = `<img src="${imgUrl}" alt="미리보기">`;
  document.getElementById('thumbPreviewWrap').style.display = '';
}
function showThumbError(msg){
  document.getElementById('thumbLoading').style.display     = 'none';
  document.getElementById('thumbPreviewWrap').style.display = 'none';
  const el = document.getElementById('thumbError');
  if(msg) el.textContent = '😅 '+msg;
  el.style.display = '';
}

function onFileUpload(event){
  const file = event.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){ alert('이미지 파일만 가능합니다!'); return; }
  if(file.size > 5 * 1024 * 1024){ alert('5MB 이하 이미지만 가능합니다!'); return; }

  uploadedImageFile = file;
  const reader = new FileReader();
  reader.onload = function(e){
    showThumbPreview(e.target.result, '📁 업로드 예정');
  };
  reader.readAsDataURL(file);
}

async function uploadImageToStorage(file){
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if(error){ console.error(error); return null; }
  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}

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
function selectEmoji(e){ document.getElementById('pfEmoji').value = e; }
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

async function savePortfolio(){
  const title    = document.getElementById('pfTitle').value.trim();
  const category = document.getElementById('pfCategory').value;
  const desc     = document.getElementById('pfDesc').value.trim();
  if(!title || !desc){ alert('제목과 설명은 필수입니다!'); return; }

  let img='', link='', emoji='🎨', bg=BG_PRESETS[0].val;

  if(currentThumbMode === 'auto'){
    link = document.getElementById('pfLink').value.trim();
    if(link && !/^https?:\/\//i.test(link)) link = 'https://' + link;

    if(uploadedImageFile){
      showThumbLoading('이미지 업로드 중...');
      const uploadedUrl = await uploadImageToStorage(uploadedImageFile);
      if(!uploadedUrl){ showThumbError('업로드 실패'); return; }
      img = uploadedUrl;
    } else {
      img = document.getElementById('pfImg').value.trim();
    }
    emoji = '🎨';
    bg = 'linear-gradient(135deg,#1a2035,#2a3446)';
  } else {
    link  = document.getElementById('pfLinkEmoji').value.trim();
    if(link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
    emoji = document.getElementById('pfEmoji').value.trim() || '🎨';
    bg    = document.getElementById('pfBg').value || BG_PRESETS[0].val;
    img   = '';
  }

  const row = {
    title, category,
    description: desc,
    image_url: img,
    emoji, bg_gradient: bg, link_url: link
  };

  if(editingId){
    const { error } = await supabase.from('portfolios').update(row).eq('id', editingId);
    if(error){ alert('저장 실패: '+error.message); return; }
  } else {
    const { error } = await supabase.from('portfolios').insert(row);
    if(error){ alert('저장 실패: '+error.message); return; }
  }

  closePfModal();
  await renderPortfolio();
}

async function editPortfolio(id){
  const p = portfolio.find(x => x.id == id);
  if(p) openPfModal(p);
}

async function deletePortfolio(id){
  if(!confirm('정말 삭제할까요?')) return;
  const { error } = await supabase.from('portfolios').delete().eq('id', id);
  if(error){ alert('삭제 실패: '+error.message); return; }
  await renderPortfolio();
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildEmojiGrid();
  buildBgGrid();
  renderPortfolio();
});
