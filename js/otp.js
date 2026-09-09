/*
Project: Trans Wallet Project
File Purpose: OTP verification workflow
Author Placeholder: Auth Developer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Provides a starter structure for the OTP confirmation flow.
*/

// ===== MODULE OWNER =====
// This file is intended for:
// Auth Developer
// Responsibilities:
// Build OTP input experience
// Handle verification state
// Support resend logic placeholders
// ================================================

const PENDING_SIGNUP_KEY = 'transwallet_pending_signup';
const USERS_KEY = 'transwallet_users';
const TRANSACTIONS_KEY = 'transwallet_transactions';
const WELCOME_BONUS = 100000;

function otpJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch (error) { return fallback; } }
function otpSave(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function newOtp() { return String(Math.floor(1000 + Math.random() * 9000)); }

function initOtpFlow() {
  const pending = otpJson(PENDING_SIGNUP_KEY, null);
  const form = document.getElementById('otpForm');
  if (!pending || !form) { window.location.replace('register.html'); return; }
  const inputs = [...document.querySelectorAll('.otp-input')];
  const alert = document.getElementById('otpAlert');
  const resend = document.getElementById('resendOtp');
  const timer = document.getElementById('otpTimer');
  let seconds = 30;
  inputs[0].focus();
  const showDemoCode = () => window.setTimeout(() => window.alert(`Your Trans Wallet verification code is ${pending.otp}.`), 3500);
  showDemoCode();
  const countdown = window.setInterval(() => { seconds -= 1; timer.textContent = seconds; if (seconds <= 0) { window.clearInterval(countdown); resend.disabled = false; resend.textContent = 'Resend code'; } }, 1000);
  inputs.forEach((input, index) => input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(-1); if (input.value && inputs[index + 1]) inputs[index + 1].focus(); }));
  inputs.forEach((input, index) => input.addEventListener('keydown', (event) => { if (event.key === 'Backspace' && !input.value && inputs[index - 1]) inputs[index - 1].focus(); }));
  inputs[0].addEventListener('paste', (event) => { const value = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4); inputs.forEach((input, index) => { input.value = value[index] || ''; }); inputs[Math.min(value.length, 3)].focus(); });
  resend.addEventListener('click', () => { pending.otp = newOtp(); otpSave(PENDING_SIGNUP_KEY, pending); resend.disabled = true; seconds = 30; timer.textContent = seconds; resend.innerHTML = 'Resend in <span id="otpTimer">30</span>s'; window.alert(`Your Trans Wallet verification code is ${pending.otp}.`); window.setTimeout(() => { resend.disabled = false; resend.textContent = 'Resend code'; }, 30000); });
  form.addEventListener('submit', (event) => { event.preventDefault(); const code = inputs.map((input) => input.value).join(''); if (code !== pending.otp) { alert.textContent = 'Incorrect verification code. Please try again.'; alert.className = 'auth-alert visible error'; inputs.forEach((input) => { input.value = ''; }); inputs[0].focus(); return; } const button = form.querySelector('button'); button.disabled = true; button.textContent = 'Verifying account...'; window.setTimeout(() => { const createdAt = new Date().toISOString(); const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; const bonus = { id: `TX-${Date.now()}`, userId: id, type: 'welcome_bonus', description: 'Trans Wallet Welcome Bonus', fiatAmount: WELCOME_BONUS, fiatCurrency: 'NGN', status: 'completed', createdAt, reference: `WELCOME-${Date.now()}` }; const user = { id, fullName: pending.fullName.trim(), username: pending.username.trim(), name: pending.fullName.trim(), email: pending.email, phone: pending.phone, password: pending.password, transactionPin: pending.transactionPin, balance: WELCOME_BONUS, fiatBalance: WELCOME_BONUS, fiatCurrency: 'NGN', transactions: [bonus], status: 'active', createdAt, joinedAt: createdAt }; otpSave(USERS_KEY, [...otpJson(USERS_KEY, []), user]); otpSave(TRANSACTIONS_KEY, [bonus, ...otpJson(TRANSACTIONS_KEY, [])]); otpSave('transwallet_user_session', { userId: id, authenticatedAt: createdAt }); otpSave('current_user', user); localStorage.removeItem(PENDING_SIGNUP_KEY); window.location.replace('welcome.html'); }, 700); });
}

document.addEventListener('DOMContentLoaded', initOtpFlow);
