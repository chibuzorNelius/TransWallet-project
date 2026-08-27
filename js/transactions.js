/*
Project: Trans Wallet Project
File Purpose: Transaction history logic
Author Placeholder: Product Engineer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Starter structure for transaction list rendering.
*/

// ===== MODULE OWNER =====
// This file is intended for:
// Product Engineer
// Responsibilities:
// Render transaction history
// Support filtering and sorting
// Display simulated activity feed
// ================================================

function readTransactions() {
  try {
    return JSON.parse(localStorage.getItem('transwallet_transactions') || sessionStorage.getItem('transwallet_transactions') || '[]');
  } catch (error) {
    return [];
  }
}

function initTransactions() {
  const container = document.querySelector('main.container .card');
  if (!container) return;
  const transactions = readTransactions();
  container.innerHTML = `<h1>Transaction history</h1><p class="transaction-intro">Your fiat payments and account activity.</p>${transactions.length ? `<div class="transaction-list">${transactions.map(transaction => `<article class="transaction-item"><div><strong>${transaction.description}</strong><span>${new Date(transaction.createdAt).toLocaleString()} · ${transaction.reference || transaction.id}</span></div><div class="transaction-amount"><strong>${transaction.fiatAmount < 0 ? '-' : '+'}${transaction.fiatCurrency} ${Math.abs(transaction.fiatAmount).toLocaleString()}</strong><span>${transaction.status}</span></div></article>`).join('')}</div>` : '<p>No transactions recorded yet.</p>'}`;
}

document.addEventListener('DOMContentLoaded', initTransactions);
