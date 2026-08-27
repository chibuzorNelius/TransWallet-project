const ADMIN_SESSION_KEY = 'transwallet_admin_session';
const ADMIN_LOGIN_PATH = 'admin-login.html';
const ADMIN_DASHBOARD_PATH = 'dashboard.html';
const ADMIN_PASSWORD = '123456789';
const APPROVED_ADMINS = [
  { name: 'Nelius', key: 'nelius' },
  { name: 'Ezekiel', key: 'ezekiel' },
  { name: 'MAZEED', key: 'mazeed' },
  { name: 'Kolawole', key: 'kolawole' },
  { name: 'HABEEB', key: 'habeeb' },
  { name: 'Blessing', key: 'blessing' },
  { name: 'dera', key: 'dera' },
  { name: 'kolade', key: 'kolade' }
];

function readAdminSession() {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
    const session = stored ? JSON.parse(stored) : null;
    return session?.isAuthenticated && session.adminName ? session : null;
  } catch (error) {
    return null;
  }
}

function saveAdminSession(adminName) {
  const session = { isAuthenticated: true, adminName, authenticatedAt: new Date().toISOString() };
  const serialized = JSON.stringify(session);
  localStorage.setItem(ADMIN_SESSION_KEY, serialized);
  sessionStorage.setItem(ADMIN_SESSION_KEY, serialized);
  return session;
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function goToAdminLogin() {
  window.location.replace(ADMIN_LOGIN_PATH);
}

function goToAdminDashboard() {
  window.location.replace(ADMIN_DASHBOARD_PATH);
}

function showAdminLoading(adminName, destination = ADMIN_DASHBOARD_PATH) {
  const loading = document.getElementById('adminLoading');
  if (!loading) {
    window.location.replace(destination);
    return;
  }
  const nameElement = document.getElementById('adminLoadingName');
  if (nameElement) nameElement.textContent = `Welcome back, ${adminName}`;
  loading.classList.remove('hidden');
  document.body.classList.add('admin-transitioning');
  window.setTimeout(() => window.location.replace(destination), 1200);
}

function initAdminLogin() {
  const session = readAdminSession();
  if (session) {
    showAdminLoading(session.adminName);
    return;
  }

  const form = document.getElementById('adminLoginForm');
  const alert = document.getElementById('adminLoginAlert');
  if (!form || !alert) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('adminName');
    const passwordInput = document.getElementById('adminPassword');
    const normalizedName = nameInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const admin = APPROVED_ADMINS.find((entry) => entry.key === normalizedName);

    alert.textContent = '';
    alert.className = 'admin-login-alert';
    if (!normalizedName) {
      alert.textContent = 'Please enter your admin name.';
    } else if (!password) {
      alert.textContent = 'Please enter your password.';
    } else if (!admin) {
      alert.textContent = 'Admin account not found.';
    } else if (password !== ADMIN_PASSWORD) {
      alert.textContent = 'Incorrect password.';
    } else {
      saveAdminSession(admin.name);
      showAdminLoading(admin.name);
      return;
    }
    alert.classList.add('admin-login-alert-visible');
  });
}

function guardAdminDashboard() {
  const session = readAdminSession();
  if (!session) {
    goToAdminLogin();
    return null;
  }
  document.body.classList.add('admin-authenticated');
  return session;
}

if (document.body.dataset.adminPage === 'login') {
  document.addEventListener('DOMContentLoaded', initAdminLogin);
} else if (document.body.dataset.adminPage === 'dashboard') {
  guardAdminDashboard();
}
