/*
Project: Trans Wallet Project
File Purpose: Authentication simulation logic
Author Placeholder: Auth Developer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Handles registration, login, and simulated session state.
*/

// ===== MODULE OWNER =====
// This file is intended for:
// Auth Developer
// Responsibilities:
// Build login and register flows
// Simulate user session state
// Route users after verification
// ================================================

const USERS_KEY = 'transwallet_users';
const SESSION_KEY = 'transwallet_user_session';
const PENDING_SIGNUP_KEY = 'transwallet_pending_signup';
const TRANSACTIONS_KEY = 'transwallet_transactions';
const WELCOME_BONUS = 10000;

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch (error) { return fallback; }
}

function writeJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getUsers() { return readJson(USERS_KEY, []); }
function getSession() { const session = readJson(SESSION_KEY, null); return session && session.userId ? session : null; }
function getCurrentUser() { const session = getSession(); return session ? getUsers().find((user) => user.id === session.userId) || null : null; }
function saveSession(user) { writeJson(SESSION_KEY, { userId: user.id, authenticatedAt: new Date().toISOString() }); writeJson('current_user', user); }
function clearUserSession() { localStorage.removeItem(SESSION_KEY); localStorage.removeItem('current_user'); localStorage.removeItem('user_session'); }
function updateUser(user) { const users = getUsers(); const index = users.findIndex((entry) => entry.id === user.id); if (index < 0) return; users[index] = user; writeJson(USERS_KEY, users); writeJson('current_user', user); }
function formatNaira(amount) { return `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function initials(name) { return (name || 'User').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }
function getUserTransactions(user) { return user ? readJson(TRANSACTIONS_KEY, []).filter((entry) => entry.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []; }

function addTransaction(user, transaction) {
  const record = { id: transaction.id || `TX-${Date.now()}`, userId: user.id, type: transaction.type || 'other', description: transaction.description || 'Wallet activity', fiatAmount: Number(transaction.fiatAmount || 0), fiatCurrency: transaction.fiatCurrency || 'NGN', status: transaction.status || 'completed', createdAt: transaction.createdAt || new Date().toISOString(), reference: transaction.reference || '' };
  const transactions = readJson(TRANSACTIONS_KEY, []);
  writeJson(TRANSACTIONS_KEY, [record, ...transactions.filter((entry) => entry.id !== record.id)]);
  user.transactions = [record, ...(user.transactions || []).filter((entry) => entry.id !== record.id)];
  updateUser(user);
  return record;
}

function requireUser() { if (document.body.classList.contains('app-logged-in') && !getCurrentUser()) { window.location.replace('login.html'); return false; } return true; }

function renderUserDashboard(user) {
  if (!user) return;
  const name = user.fullName || user.name || user.username;
  document.querySelector('.greeting h1')?.replaceChildren(document.createTextNode(`Welcome back, ${name} `));
  const greeting = document.querySelector('.greeting h1');
  if (greeting) greeting.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-hand-wave"></i>');
  document.querySelector('.profile span')?.replaceChildren(document.createTextNode(name));
  document.querySelector('.avatar')?.replaceChildren(document.createTextNode(initials(name)));
  const balance = document.getElementById('balanceAmount'); if (balance) balance.textContent = formatNaira(user.balance);
  const usd = document.getElementById('balanceUsd'); if (usd) usd.textContent = `≈ $${(Number(user.balance || 0) / 1600).toFixed(2)} USD`;
  document.querySelector('.wallet-item .wallet-bal')?.replaceChildren(document.createTextNode(formatNaira(user.balance)));
  const list = document.querySelector('.tx-list'); if (!list) return;
  const transactions = getUserTransactions(user).slice(0, 5);
  list.innerHTML = transactions.length ? transactions.map((entry) => { const amount = Number(entry.fiatAmount || entry.amount || 0); const positive = amount >= 0; return `<div class="tx-item"><div class="tx-icon ${positive ? 'green' : 'blue'}"><i class="fa-solid ${positive ? 'fa-arrow-down' : 'fa-paper-plane'}"></i></div><div class="tx-info"><div class="tx-name">${entry.description}</div><div class="tx-date">${new Date(entry.createdAt).toLocaleString()}</div></div><div class="tx-right"><div class="tx-amount ${positive ? 'positive' : 'negative'}">${positive ? '+' : '-'} ${formatNaira(Math.abs(amount))}</div><div class="tx-status completed">${entry.status || 'Completed'}</div></div></div>`; }).join('') : '<p class="dashboard-empty">No transactions yet.</p>';
}

function initLogin() {
  const form = document.getElementById('loginForm'); if (!form) return;
  const alert = document.getElementById('authAlert');
  form.addEventListener('submit', (event) => { event.preventDefault(); const identifier = form.identifier.value.trim().toLowerCase(); const user = getUsers().find((entry) => [entry.email, entry.phone, entry.username].map((value) => String(value || '').toLowerCase()).includes(identifier)); if (!user || user.password !== form.password.value) { alert.textContent = 'The email, phone number, or password is incorrect.'; alert.className = 'auth-alert visible error'; return; } form.querySelector('button').disabled = true; form.querySelector('button').textContent = 'Signing you in...'; saveSession(user); window.setTimeout(() => window.location.replace('dashboard.html'), 500); });
}

function initRegister() {
  const form = document.getElementById('registerForm'); if (!form) return;
  const alert = document.getElementById('authAlert');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const email = String(data.email || '').trim().toLowerCase();
    const phone = String(data.phone || '').trim();
    const username = String(data.username || '').trim();
    const policyAccepted = Boolean(form.elements.namedItem('policy')?.checked);
    const valid = Boolean(String(data.fullName || '').trim() && username && email && phone && data.password && data.password.length >= 6 && data.password === data.confirmPassword && /^\d{4,6}$/.test(String(data.transactionPin || '')) && data.transactionPin === data.confirmPin && policyAccepted);
    if (!valid) { alert.textContent = 'Complete all fields, matching passwords and PINs, and accept the policy.'; alert.className = 'auth-alert visible error'; return; }
    const users = getUsers();
    if (users.some((user) => String(user.email || '').trim().toLowerCase() === email)) { alert.textContent = 'An account already exists with this email.'; alert.className = 'auth-alert visible error'; return; }
    if (users.some((user) => String(user.phone || '').trim() === phone)) { alert.textContent = 'This phone number is already registered.'; alert.className = 'auth-alert visible error'; return; }
    if (users.some((user) => String(user.username || '').trim().toLowerCase() === username.toLowerCase())) { alert.textContent = 'That username is already taken.'; alert.className = 'auth-alert visible error'; return; }
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    writeJson(PENDING_SIGNUP_KEY, { ...data, fullName: String(data.fullName).trim(), username, email, phone, otp, createdAt: new Date().toISOString() });
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Preparing verification...'; }
    window.setTimeout(() => window.location.replace('otp.html'), 450);
  });
}

function initAuth() { 
  if (!requireUser()) return; 
  initLogin(); 
  initRegister(); 
  if (document.body.classList.contains('app-logged-in')) {
    renderUserDashboard(getCurrentUser());
    setupNotificationPanel();
    setupBalanceToggle();
  }
}

function setupNotificationPanel() {
  const notifBell = document.querySelector('.notif');
  const notifPanel = document.getElementById('notifPanel');
  const notifClose = document.getElementById('notifClose');
  
  if (!notifBell || !notifPanel) return;
  
  // Toggle panel on bell click
  notifBell.addEventListener('click', (e) => {
    e.stopPropagation();
    notifPanel.classList.toggle('visible');
  });
  
  // Close button
  if (notifClose) {
    notifClose.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.remove('visible');
    });
  }
  
  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!notifBell.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.remove('visible');
    }
  });
  
  // Close panel when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && notifPanel.classList.contains('visible')) {
      notifPanel.classList.remove('visible');
    }
  });
}

function setupBalanceToggle() {
  const eyeToggle = document.getElementById('eyeToggle');
  const balanceAmount = document.getElementById('balanceAmount');
  const balanceUsd = document.getElementById('balanceUsd');
  
  if (!eyeToggle || !balanceAmount) return;
  
  let isBalanceVisible = true;
  const originalBalance = balanceAmount.textContent;
  const originalUsd = balanceUsd?.textContent || '';
  
  eyeToggle.addEventListener('click', () => {
    isBalanceVisible = !isBalanceVisible;
    
    if (isBalanceVisible) {
      // Show balance
      balanceAmount.textContent = originalBalance;
      if (balanceUsd) balanceUsd.textContent = originalUsd;
      eyeToggle.classList.remove('fa-eye-slash');
      eyeToggle.classList.add('fa-eye');
    } else {
      // Hide balance with asterisks
      const maskedBalance = '******* ****';
      balanceAmount.textContent = maskedBalance;
      if (balanceUsd) balanceUsd.textContent = '≈ *** USD';
      eyeToggle.classList.remove('fa-eye');
      eyeToggle.classList.add('fa-eye-slash');
    }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAuth);
else initAuth();
