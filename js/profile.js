const STORAGE_KEY = 'voyago_demo_profile_v1';
const SESSION_KEY = 'voyago_demo_session_v1';
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function getProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}
function setProfile(profile) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); return true; }
  catch (error) { showToast('Браузер запретил сохранение данных. Открой сайт в обычном окне браузера и попробуй снова.'); return false; }
}
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}
function setSession(profile) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: profile.email })); return true; }
  catch (error) { showToast('Не удалось создать сессию в этом браузере.'); return false; }
}
function initials(name) {
  return (name || 'V').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'V';
}
function showLoggedOut() {
  document.getElementById('authCard').hidden = false;
  document.getElementById('accountCard').hidden = true;
  document.getElementById('logoutBtn').hidden = true;
  document.getElementById('sidebarName').textContent = 'Гость Voyago';
  document.getElementById('sidebarEmail').textContent = 'Создайте профиль для удобства';
  document.getElementById('sidebarAvatar').textContent = 'V';
}
function showProfile(profile) {
  document.getElementById('authCard').hidden = true;
  document.getElementById('accountCard').hidden = false;
  document.getElementById('logoutBtn').hidden = false;
  document.getElementById('sidebarName').textContent = profile.name;
  document.getElementById('sidebarEmail').textContent = profile.email;
  document.getElementById('sidebarAvatar').textContent = initials(profile.name);
  document.getElementById('accountAvatar').textContent = initials(profile.name);
  document.getElementById('accountName').textContent = profile.name;
  document.getElementById('accountEmail').textContent = profile.email;
  document.getElementById('detailsName').textContent = profile.name;
  document.getElementById('detailsEmail').textContent = profile.email;
}
function switchAuth(mode) {
  const register = mode === 'register';
  document.getElementById('registerForm').hidden = !register;
  document.getElementById('loginForm').hidden = register;
  document.getElementById('registerTab').classList.toggle('active', register);
  document.getElementById('loginTab').classList.toggle('active', !register);
  document.getElementById('registerTab').setAttribute('aria-selected', String(register));
  document.getElementById('loginTab').setAttribute('aria-selected', String(!register));
}
document.getElementById('registerTab').addEventListener('click', () => switchAuth('register'));
document.getElementById('loginTab').addEventListener('click', () => switchAuth('login'));

document.getElementById('registerForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  if (!name || !email || !password) {
    showToast('Заполни все обязательные поля.');
    return;
  }
  if (password.length < 6) { showToast('Пароль должен содержать минимум 6 символов.'); return; }
  const existing = getProfile();
  if (existing && existing.email === email) { showToast('Этот email уже зарегистрирован. Перейди во вкладку «Войти».'); switchAuth('login'); document.getElementById('loginEmail').value = email; return; }
  // Учебный пример: пароль хранится локально в открытом виде — не использовать в реальном проекте.
  const profile = { name, email, password, createdAt: new Date().toISOString() };
  if (!setProfile(profile)) return;
  if (!setSession(profile)) return;
  showProfile(profile);
  showToast('Демо-профиль создан! Данные сохранены в этом браузере.');
});

document.getElementById('loginForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const profile = getProfile();
  if (!profile || profile.email !== email || profile.password !== password) {
    showToast('Профиль не найден или данные не совпадают. Зарегистрируйся в этом браузере.');
    return;
  }
  if (!setSession(profile)) return;
  showProfile(profile);
  showToast('Ты вошёл в демо-профиль.');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLoggedOut();
  switchAuth('login');
  showToast('Вы вышли из профиля.');
});

document.getElementById('editBtn').addEventListener('click', () => {
  const profile = getProfile();
  if (!profile) return;
  document.getElementById('editName').value = profile.name;
  document.getElementById('editEmail').value = profile.email;
  document.getElementById('editPassword').value = '';
  document.getElementById('editForm').hidden = false;
  document.getElementById('editBtn').hidden = true;
});
document.getElementById('cancelEdit').addEventListener('click', () => {
  document.getElementById('editForm').hidden = true;
  document.getElementById('editBtn').hidden = false;
});
document.getElementById('editForm').addEventListener('submit', event => {
  event.preventDefault();
  const profile = getProfile();
  if (!profile) return;
  profile.name = document.getElementById('editName').value.trim();
  profile.email = document.getElementById('editEmail').value.trim().toLowerCase();
  const newPassword = document.getElementById('editPassword').value;
  if (newPassword) profile.password = newPassword;
  if (!profile.name || !profile.email) { showToast('Укажи имя и корректную почту.'); return; }
  if (!setProfile(profile)) return;
  if (!setSession(profile)) return;
  showProfile(profile);
  document.getElementById('editForm').hidden = true;
  document.getElementById('editBtn').hidden = false;
  showToast('Данные демо-профиля обновлены.');
});

document.getElementById('menuBtn')?.addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  const isOpen = nav.classList.toggle('open');
  document.getElementById('menuBtn').setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.main-nav')?.classList.remove('open')));

const storedProfile = getProfile();
const session = getSession();
if (storedProfile && session && session.email === storedProfile.email) showProfile(storedProfile);
else showLoggedOut();
