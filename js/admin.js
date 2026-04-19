/* ============================================================
   온종일 · admin.js — localStorage 비밀번호 관리
   ============================================================ */

const DEFAULT_PW = '123456';

function getStoredPassword(){ return localStorage.getItem('onjongil-admin-pw') || DEFAULT_PW; }
function setStoredPassword(pw){ localStorage.setItem('onjongil-admin-pw', pw); }

const adminToggle = document.getElementById('adminToggle');
const adminIcon   = document.getElementById('adminIcon');
const adminText   = document.getElementById('adminText');
const pwChangeBtn = document.getElementById('pwChangeBtn');

function setAdminMode(active){
  document.body.classList.toggle('admin-mode', active);
  adminToggle.classList.toggle('active', active);
  adminIcon.textContent = active ? '🔓' : '🔒';
  adminText.textContent = active ? '관리 중 (로그아웃)' : '관리자 모드';
  pwChangeBtn.style.display = active ? 'inline-flex' : 'none';
}

adminToggle.addEventListener('click', ()=>{
  if(document.body.classList.contains('admin-mode')){
    setAdminMode(false);
  } else {
    document.getElementById('pwInput').value = '';
    document.getElementById('pwError').style.display = 'none';
    document.getElementById('pwModal').classList.add('active');
    setTimeout(()=>document.getElementById('pwInput').focus(), 100);
  }
});

window.checkPassword = function(){
  const input = document.getElementById('pwInput').value;
  if(input === getStoredPassword()){
    document.getElementById('pwModal').classList.remove('active');
    setAdminMode(true);
  } else {
    document.getElementById('pwError').style.display = 'block';
  }
};

window.closePwModal = function(){
  document.getElementById('pwModal').classList.remove('active');
};

pwChangeBtn.addEventListener('click', ()=>{
  ['pwCurrent','pwNew','pwConfirm'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('pwChangeError').style.display   = 'none';
  document.getElementById('pwChangeSuccess').style.display = 'none';
  document.getElementById('pwChangeModal').classList.add('active');
});

window.changePassword = function(){
  const cur   = document.getElementById('pwCurrent').value;
  const nw    = document.getElementById('pwNew').value;
  const cf    = document.getElementById('pwConfirm').value;
  const errEl = document.getElementById('pwChangeError');
  const okEl  = document.getElementById('pwChangeSuccess');
  okEl.style.display = 'none';

  if(cur !== getStoredPassword()){ errEl.textContent='현재 비밀번호가 일치하지 않습니다.'; errEl.style.display='block'; return; }
  if(nw.length < 4){ errEl.textContent='새 비밀번호는 4자 이상이어야 합니다.'; errEl.style.display='block'; return; }
  if(nw !== cf){ errEl.textContent='새 비밀번호가 일치하지 않습니다.'; errEl.style.display='block'; return; }

  setStoredPassword(nw);
  errEl.style.display = 'none';
  okEl.style.display  = 'block';
  setTimeout(()=>{ window.closePwChangeModal(); }, 1000);
};

window.closePwChangeModal = function(){
  document.getElementById('pwChangeModal').classList.remove('active');
};

document.getElementById('pwModal').addEventListener('click', e=>{ if(e.target.id==='pwModal') window.closePwModal(); });
document.getElementById('pwChangeModal').addEventListener('click', e=>{ if(e.target.id==='pwChangeModal') window.closePwChangeModal(); });
document.getElementById('pfModal').addEventListener('click', e=>{ if(e.target.id==='pfModal') window.closePfModal(); });
