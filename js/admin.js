/* ============================================================
   온종일 · admin.js  — Supabase 연동 비밀번호 관리
   ============================================================ */

async function getStoredPassword(){
  const { data, error } = await supabase
    .from('admin_settings')
    .select('password_hash')
    .eq('id', 1)
    .single();
  if(error || !data) return '123456';
  return data.password_hash;
}

async function setStoredPassword(pw){
  const { error } = await supabase
    .from('admin_settings')
    .update({ password_hash: pw, updated_at: new Date().toISOString() })
    .eq('id', 1);
  return !error;
}

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
  const isActive = document.body.classList.contains('admin-mode');
  if(isActive){
    setAdminMode(false);
  } else {
    document.getElementById('pwInput').value = '';
    document.getElementById('pwError').style.display = 'none';
    document.getElementById('pwModal').classList.add('active');
    setTimeout(()=>document.getElementById('pwInput').focus(), 100);
  }
});

async function checkPassword(){
  const input  = document.getElementById('pwInput').value;
  const stored = await getStoredPassword();
  if(input === stored){
    document.getElementById('pwModal').classList.remove('active');
    setAdminMode(true);
  } else {
    document.getElementById('pwError').style.display = 'block';
  }
}

function closePwModal(){
  document.getElementById('pwModal').classList.remove('active');
}

pwChangeBtn.addEventListener('click', ()=>{
  document.getElementById('pwCurrent').value = '';
  document.getElementById('pwNew').value     = '';
  document.getElementById('pwConfirm').value = '';
  document.getElementById('pwChangeError').style.display   = 'none';
  document.getElementById('pwChangeSuccess').style.display = 'none';
  document.getElementById('pwChangeModal').classList.add('active');
});

async function changePassword(){
  const cur   = document.getElementById('pwCurrent').value;
  const nw    = document.getElementById('pwNew').value;
  const cf    = document.getElementById('pwConfirm').value;
  const errEl = document.getElementById('pwChangeError');
  const okEl  = document.getElementById('pwChangeSuccess');
  okEl.style.display = 'none';

  const stored = await getStoredPassword();
  if(cur !== stored){
    errEl.textContent = '현재 비밀번호가 일치하지 않습니다.';
    errEl.style.display = 'block'; return;
  }
  if(nw.length < 4){
    errEl.textContent = '새 비밀번호는 4자 이상이어야 합니다.';
    errEl.style.display = 'block'; return;
  }
  if(nw !== cf){
    errEl.textContent = '새 비밀번호가 일치하지 않습니다.';
    errEl.style.display = 'block'; return;
  }

  const success = await setStoredPassword(nw);
  if(!success){
    errEl.textContent = '비밀번호 변경에 실패했습니다.';
    errEl.style.display = 'block'; return;
  }

  errEl.style.display = 'none';
  okEl.style.display  = 'block';
  setTimeout(()=>{ closePwChangeModal(); }, 1000);
}

function closePwChangeModal(){
  document.getElementById('pwChangeModal').classList.remove('active');
}
