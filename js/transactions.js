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

const TRANSACTION_FILTERS = {
  all: 'All',
  credits: 'Credits',
  debits: 'Debits',
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed'
};

function toNumber(value) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value, currency = 'NGN') {
  const safeValue = toNumber(value);
  const sign = safeValue >= 0 ? '+' : '-';
  const absolute = Math.abs(safeValue);
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(absolute);

  return `${sign} ${currency} ${formatted}`;
}

function formatMoneyShort(value, currency = 'NGN') {
  const safeValue = toNumber(value);
  const absolute = Math.abs(safeValue);
  return `${currency} ${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(absolute)}`;
}

function getStatusClass(status) {
  const normalized = String(status || 'completed').toLowerCase();
  if (['completed', 'successful', 'success'].includes(normalized)) return 'success';
  if (['pending', 'processing'].includes(normalized)) return 'warning';
  if (['failed', 'rejected', 'cancelled', 'canceled'].includes(normalized)) return 'danger';
  return 'neutral';
}

function getStatusLabel(status) {
  const normalized = String(status || 'completed').toLowerCase();
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'failed') return 'Failed';
  if (normalized === 'rejected') return 'Rejected';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Cancelled';
  return 'Completed';
}

function getTransactionDirection(amount) {
  return toNumber(amount) >= 0 ? 'credit' : 'debit';
}

function getTransactionIcon(type, description) {
  const t = String(type || description || '').toLowerCase();
  if (t.includes('welcome') || t.includes('bonus')) return '✦';
  if (t.includes('crypto') || t.includes('btc') || t.includes('coin')) return '₿';
  if (t.includes('bill') || t.includes('utility') || t.includes('receipt')) return '▣';
  if (t.includes('exchange') || t.includes('swap')) return '⇄';
  if (t.includes('transfer') || t.includes('send') || t.includes('withdraw')) return '↗';
  if (t.includes('receive') || t.includes('credit') || t.includes('deposit')) return '↘';
  return '◉';
}

function getTransactionTypeLabel(type, description) {
  const t = String(type || description || '').toLowerCase();
  if (t.includes('welcome')) return 'Welcome bonus';
  if (t.includes('send') || t.includes('transfer')) return 'Transfer';
  if (t.includes('receive') || t.includes('deposit')) return 'Received';
  if (t.includes('crypto')) return 'Crypto';
  if (t.includes('exchange')) return 'Exchange';
  if (t.includes('bill')) return 'Bill payment';
  if (t.includes('withdraw')) return 'Withdrawal';
  if (description) return description;
  return 'Wallet activity';
}

function getGroupLabel(dateValue) {
  const date = new Date(dateValue);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (first, second) => {
    return first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();
  };

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function getTransactionReference(transaction) {
  return transaction.reference || transaction.id || 'N/A';
}

function getDisplayDate(dateValue) {
  return new Date(dateValue).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getSummaryStats(transactions) {
  const total = transactions.length;
  const moneyIn = transactions
    .filter((transaction) => toNumber(transaction.fiatAmount) >= 0)
    .reduce((sum, transaction) => sum + toNumber(transaction.fiatAmount), 0);
  const moneyOut = transactions
    .filter((transaction) => toNumber(transaction.fiatAmount) < 0)
    .reduce((sum, transaction) => sum + Math.abs(toNumber(transaction.fiatAmount)), 0);
  const pending = transactions.filter((transaction) => String(transaction.status || '').toLowerCase() === 'pending').length;

  return { total, moneyIn, moneyOut, pending };
}

function buildTransactionMarkup(transaction) {
  const amount = toNumber(transaction.fiatAmount || transaction.amount || 0);
  const direction = getTransactionDirection(amount);
  const status = getStatusClass(transaction.status);
  const statusLabel = getStatusLabel(transaction.status);
  const icon = getTransactionIcon(transaction.type, transaction.description);
  const detailType = getTransactionTypeLabel(transaction.type, transaction.description);
  const reference = getTransactionReference(transaction);

  return `
    <article class="transaction-entry ${direction === 'credit' ? 'credit-entry' : 'debit-entry'}">
      <button type="button" class="transaction-row" data-id="${transaction.id || reference}" aria-expanded="false">
        <div class="transaction-identity">
          <span class="transaction-icon ${direction === 'credit' ? 'credit' : 'debit'}">${icon}</span>
          <div class="transaction-copy">
            <strong>${transaction.description || 'Wallet activity'}</strong>
            <span>${detailType} • ${reference}</span>
            <time>${getDisplayDate(transaction.createdAt)}</time>
          </div>
        </div>
        <div class="transaction-meta">
          <span class="transaction-amount ${direction === 'credit' ? 'credit' : 'debit'}">${formatCurrency(amount, transaction.fiatCurrency || 'NGN')}</span>
          <span class="status-pill ${status}">${statusLabel}</span>
        </div>
      </button>
      <div class="transaction-details" hidden>
        <div class="detail-grid">
          <div><span class="detail-label">Type</span><strong>${detailType}</strong></div>
          <div><span class="detail-label">Amount</span><strong>${formatMoneyShort(amount, transaction.fiatCurrency || 'NGN')}</strong></div>
          <div><span class="detail-label">Status</span><strong>${statusLabel}</strong></div>
          <div><span class="detail-label">Reference</span><strong>${reference}</strong></div>
        </div>
        <p class="detail-note">${transaction.description || 'Wallet activity'} • ${getDisplayDate(transaction.createdAt)}</p>
      </div>
    </article>
  `;
}

function groupByDate(transactions) {
  return transactions.reduce((groups, transaction) => {
    const label = getGroupLabel(transaction.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(transaction);
    return groups;
  }, {});
}

function renderSummary(transactions) {
  const summary = getSummaryStats(transactions);
  const totalEl = document.getElementById('summaryTotal');
  const creditEl = document.getElementById('summaryCredit');
  const debitEl = document.getElementById('summaryDebit');
  const pendingEl = document.getElementById('summaryPending');

  if (totalEl) totalEl.textContent = String(summary.total);
  if (creditEl) creditEl.textContent = `₦${new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(summary.moneyIn)}`;
  if (debitEl) debitEl.textContent = `₦${new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(summary.moneyOut)}`;
  if (pendingEl) pendingEl.textContent = String(summary.pending);
}

function renderTransactionGroups(transactions) {
  const container = document.getElementById('transactionGroups');
  const emptyState = document.getElementById('transactionEmpty');

  if (!container) return;

  if (!transactions.length) {
    container.innerHTML = '';
    emptyState?.classList.remove('hidden');
    return;
  }

  emptyState?.classList.add('hidden');

  const grouped = groupByDate(transactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(grouped[a][0].createdAt).getTime();
    const dateB = new Date(grouped[b][0].createdAt).getTime();
    return dateB - dateA;
  });

  container.innerHTML = sortedDates.map((groupLabel) => {
    const items = grouped[groupLabel].map(buildTransactionMarkup).join('');
    return `
      <div class="transaction-group">
        <div class="group-label">${groupLabel}</div>
        <div class="transaction-list">${items}</div>
      </div>
    `;
  }).join('');
}

function applyTransactionFilters() {
  const searchInput = document.getElementById('transactionSearch');
  const filterButtons = document.querySelectorAll('.filter-chip');
  const currentFilter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
  const query = (searchInput?.value || '').trim().toLowerCase();

  const transactions = readTransactions().filter((transaction) => {
    const haystack = [
      transaction.description,
      transaction.reference,
      transaction.type,
      transaction.id,
      getTransactionTypeLabel(transaction.type, transaction.description)
    ].join(' ').toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    const amount = toNumber(transaction.fiatAmount || transaction.amount || 0);
    const status = String(transaction.status || '').toLowerCase();

    let matchesFilter = true;
    if (currentFilter === 'credits') matchesFilter = amount >= 0;
    if (currentFilter === 'debits') matchesFilter = amount < 0;
    if (currentFilter === 'pending') matchesFilter = status === 'pending';
    if (currentFilter === 'completed') matchesFilter = ['completed', 'successful', 'success'].includes(status);
    if (currentFilter === 'failed') matchesFilter = ['failed', 'rejected', 'cancelled', 'canceled'].includes(status);

    return matchesSearch && matchesFilter;
  });

  renderSummary(readTransactions());
  renderTransactionGroups(transactions);

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function bindTransactionControls() {
  const searchInput = document.getElementById('transactionSearch');
  const filterButtons = document.querySelectorAll('.filter-chip');

  searchInput?.addEventListener('input', applyTransactionFilters);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      applyTransactionFilters();
    });
  });

  document.getElementById('transactionGroups')?.addEventListener('click', (event) => {
    const trigger = event.target.closest('.transaction-row');
    if (!trigger) return;
    const entry = trigger.closest('.transaction-entry');
    const details = entry?.querySelector('.transaction-details');
    if (!details) return;

    const isOpen = !details.hidden;
    details.hidden = isOpen;
    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
}

function readTransactions() {
  try {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const transactions = JSON.parse(localStorage.getItem('transwallet_transactions') || '[]');
    const list = user ? transactions.filter((transaction) => transaction.userId === user.id) : [];
    return list.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
  } catch (error) {
    return [];
  }
}

function initTransactions() {
  bindTransactionControls();
  const transactions = readTransactions();
  renderSummary(transactions);
  renderTransactionGroups(transactions);
}

document.addEventListener('DOMContentLoaded', initTransactions);
