/*
Project: Trans Wallet Project
File Purpose: Send and receive money interactions
Author Placeholder: Payments Developer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Premium local and global transfer flows with verification, review, PIN validation, and balance updates.
*/

const BANKS = [
  { id: 'access', name: 'Access Bank', code: '044', tag: 'A' },
  { id: 'gtbank', name: 'GTBank', code: '058', tag: 'G' },
  { id: 'firstbank', name: 'FirstBank', code: '011', tag: 'F' },
  { id: 'uba', name: 'UBA', code: '033', tag: 'U' },
  { id: 'zenith', name: 'Zenith Bank', code: '057', tag: 'Z' },
  { id: 'fidelity', name: 'Fidelity Bank', code: '070', tag: 'Fi' },
  { id: 'sterling', name: 'Sterling Bank', code: '232', tag: 'S' },
  { id: 'union', name: 'Union Bank', code: '032', tag: 'U' }
];

const DEMO_RECIPIENTS = [
  'Aisha Bello',
  'Chinedu Okafor',
  'Maya Ibrahim',
  'James Adebayo',
  'Grace Eze',
  'Tobi Adeyemi',
  'Nneka Umeh',
  'Daniel Kola',
  'Amara Nwosu',
  'Rasheed Yusuf'
];

let currentTransferType = 'local';
let selectedBank = null;
let recipientState = null;
let activeTransferAmount = 0;
let activeReview = null;

function formatNaira(value) {
  return `₦${Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function maskAccountNumber(accountNumber) {
  const safeNumber = String(accountNumber || '').replace(/\D/g, '');
  if (!safeNumber) return '•••••••••';
  return `••••${safeNumber.slice(-4)}`;
}

function getCurrentUserBalance() {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  return Number(user?.balance || 0);
}

function toggleTransferView(viewId) {
  const panels = document.querySelectorAll('.transfer-panel');
  panels.forEach((panel) => {
    const isTarget = panel.id === viewId;
    panel.classList.toggle('transfer-panel-hidden', !isTarget);
    panel.classList.toggle('transfer-panel-visible', isTarget);
  });
}

function resetLocalTransferState() {
  selectedBank = null;
  recipientState = null;
  activeTransferAmount = 0;
  activeReview = null;

  const accountNumber = document.getElementById('accountNumber');
  const bankSearch = document.getElementById('bankSearch');
  const transferAmount = document.getElementById('transferAmount');
  if (accountNumber) accountNumber.value = '';
  if (bankSearch) bankSearch.value = '';
  if (transferAmount) transferAmount.value = '';

  const verificationState = document.getElementById('verificationState');
  const verificationFailure = document.getElementById('verificationFailure');
  const recipientVerified = document.getElementById('recipientVerified');
  const amountSection = document.getElementById('amountSection');
  const amountError = document.getElementById('amountError');
  const continueButton = document.getElementById('continueToReviewBtn');
  const bankOptions = document.querySelectorAll('.bank-option');

  bankOptions.forEach((option) => option.classList.remove('selected'));
  verificationState?.classList.add('hidden');
  verificationFailure?.classList.add('hidden');
  recipientVerified?.classList.add('hidden');
  amountSection?.classList.add('hidden');
  amountError?.classList.add('hidden');
  continueButton && (continueButton.disabled = true);

  updateAsideSummary();
}

function updateLandingBalance() {
  const balance = document.getElementById('landingBalance');
  if (balance) balance.textContent = formatNaira(getCurrentUserBalance());
  const available = document.getElementById('availableBalanceText');
  if (available) available.textContent = formatNaira(getCurrentUserBalance());
}

function getBankOptions(searchTerm = '') {
  const query = searchTerm.trim().toLowerCase();
  return BANKS.filter((bank) => !query || bank.name.toLowerCase().includes(query) || bank.code.includes(query));
}

function renderBankOptions(searchTerm = '') {
  const bankSelector = document.getElementById('bankSelector');
  if (!bankSelector) return;

  const filtered = getBankOptions(searchTerm);
  bankSelector.innerHTML = filtered.map((bank) => `
    <button type="button" class="bank-option ${selectedBank && selectedBank.id === bank.id ? 'selected' : ''}" data-bank-id="${bank.id}">
      <span class="bank-logo">${bank.tag}</span>
      <span class="bank-name">${bank.name}</span>
    </button>
  `).join('');

  bankSelector.querySelectorAll('.bank-option').forEach((button) => {
    button.addEventListener('click', () => {
      const nextBank = BANKS.find((bank) => bank.id === button.dataset.bankId);
      selectedBank = nextBank || null;
      renderBankOptions(document.getElementById('bankSearch')?.value || '');
      updateAsideSummary();
    });
  });
}

function simulateRecipientVerification() {
  const accountInput = document.getElementById('accountNumber');
  const verificationState = document.getElementById('verificationState');
  const verificationFailure = document.getElementById('verificationFailure');
  const recipientVerified = document.getElementById('recipientVerified');
  const amountSection = document.getElementById('amountSection');
  const amountError = document.getElementById('amountError');
  const verifiedName = document.getElementById('verifiedName');
  const verifiedBank = document.getElementById('verifiedBank');
  const verifiedAccount = document.getElementById('verifiedAccount');

  const accountNumber = String(accountInput?.value || '').replace(/\D/g, '');
  if (!accountNumber || accountNumber.length < 10 || !selectedBank) {
    verificationFailure?.classList.remove('hidden');
    verificationState?.classList.add('hidden');
    return;
  }

  verificationFailure?.classList.add('hidden');
  verificationState?.classList.remove('hidden');
  recipientVerified?.classList.add('hidden');
  amountSection?.classList.add('hidden');
  amountError?.classList.add('hidden');

  const seed = `${selectedBank.id}-${accountNumber}`;
  const index = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0) % DEMO_RECIPIENTS.length;
  const recipientName = DEMO_RECIPIENTS[index];

  window.setTimeout(() => {
    verificationState?.classList.add('hidden');
    recipientState = { name: recipientName, bank: selectedBank.name, accountNumber: accountNumber };
    if (verifiedName) verifiedName.textContent = recipientName;
    if (verifiedBank) verifiedBank.textContent = selectedBank.name;
    if (verifiedAccount) verifiedAccount.textContent = accountNumber.slice(-4);
    recipientVerified?.classList.remove('hidden');
    amountSection?.classList.remove('hidden');
    updateAsideSummary();
  }, 1200);
}

function updateAsideSummary() {
  const asideRecipient = document.getElementById('asideRecipient');
  const asideBank = document.getElementById('asideBank');
  const asideAccount = document.getElementById('asideAccount');
  const asideAmount = document.getElementById('asideAmount');
  const continueButton = document.getElementById('continueToReviewBtn');

  const recipientName = recipientState?.name || '—';
  const bankName = selectedBank?.name || '—';
  const maskedAccount = recipientState ? maskAccountNumber(recipientState.accountNumber) : '—';
  const amount = activeTransferAmount > 0 ? formatNaira(activeTransferAmount) : '—';

  if (asideRecipient) asideRecipient.textContent = recipientName;
  if (asideBank) asideBank.textContent = bankName;
  if (asideAccount) asideAccount.textContent = maskedAccount;
  if (asideAmount) asideAmount.textContent = amount;

  const currentAmount = Number(document.getElementById('transferAmount')?.value || 0);
  const valid = !!recipientState && selectedBank && currentAmount > 0 && Number(currentAmount) <= getCurrentUserBalance();
  if (continueButton) continueButton.disabled = !valid;
}

function buildReviewSummary() {
  if (!recipientState || !selectedBank) return;
  const transferAmount = Number(document.getElementById('transferAmount')?.value || 0);
  if (!transferAmount || transferAmount > getCurrentUserBalance()) {
    return;
  }

  activeTransferAmount = transferAmount;
  const reviewRecipient = document.getElementById('reviewRecipient');
  const reviewBank = document.getElementById('reviewBank');
  const reviewAccount = document.getElementById('reviewAccount');
  const reviewAmount = document.getElementById('reviewAmount');

  if (reviewRecipient) reviewRecipient.textContent = recipientState.name;
  if (reviewBank) reviewBank.textContent = selectedBank.name;
  if (reviewAccount) reviewAccount.textContent = maskAccountNumber(recipientState.accountNumber);
  if (reviewAmount) reviewAmount.textContent = formatNaira(activeTransferAmount);

  activeReview = {
    recipient: recipientState.name,
    bank: selectedBank.name,
    accountNumber: recipientState.accountNumber,
    amount: activeTransferAmount
  };
}

function validateTransferAmount() {
  const amountField = document.getElementById('transferAmount');
  const amountError = document.getElementById('amountError');
  const amount = Number(amountField?.value || 0);
  const availableBalance = getCurrentUserBalance();

  if (!amount || amount <= 0) {
    amountError?.classList.remove('hidden');
    amountError.textContent = 'Please enter an amount greater than zero.';
    return false;
  }

  if (amount > availableBalance) {
    amountError?.classList.remove('hidden');
    amountError.textContent = 'Insufficient balance. Please enter an amount within your available balance.';
    return false;
  }

  amountError?.classList.add('hidden');
  activeTransferAmount = amount;
  updateAsideSummary();
  return true;
}

function renderGlobalFX() {
  const fromCurrency = document.getElementById('globalFromCurrency')?.value || 'USD';
  const amount = Number(document.getElementById('globalAmount')?.value || 0);
  const fxRate = window.TransWalletExchange?.getRateSummary?.(amount, fromCurrency, 'NGN');

  const fromAmount = document.getElementById('fxFromAmount');
  const rateLine = document.getElementById('fxRateLine');
  const recipientAmount = document.getElementById('fxRecipientAmount');

  if (fromAmount) fromAmount.textContent = `${fromCurrency} ${Number(amount || 0).toFixed(2)}`;
  if (rateLine) rateLine.textContent = `1 ${fromCurrency} = ${formatNaira(fxRate?.rate || 1600)}`;
  if (recipientAmount) recipientAmount.textContent = formatNaira(fxRate?.converted || 0);
}

function openUserPin() {
  const pinInputs = document.querySelectorAll('.pin-box');
  pinInputs.forEach((input) => {
    input.value = '';
    input.addEventListener('input', () => {
      if (input.value && input.nextElementSibling) {
        input.nextElementSibling.focus();
      }
    });
  });
  document.getElementById('pinError')?.classList.add('hidden');
  toggleTransferView('pinTransferView');
}

function collectPin() {
  const pinInputs = [...document.querySelectorAll('.pin-box')];
  return pinInputs.map((input) => input.value).join('');
}

function verifyPin() {
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const enteredPin = collectPin();
  const pinError = document.getElementById('pinError');

  if (!currentUser || String(currentUser.transactionPin || '') !== String(enteredPin)) {
    pinError?.classList.remove('hidden');
    return false;
  }

  pinError?.classList.add('hidden');
  return true;
}

function completeTransfer() {
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const amount = Number(activeReview?.amount || 0);
  if (!currentUser || !activeReview || !amount) return;

  const nextBalance = Number(currentUser.balance || 0) - amount;
  currentUser.balance = Math.max(0, nextBalance);
  if (typeof updateUser === 'function') {
    updateUser(currentUser);
  }

  const transactionRecord = {
    id: `TX-${Date.now()}`,
    userId: currentUser.id,
    type: 'transfer',
    description: `Send Money to ${activeReview.recipient}`,
    fiatAmount: -amount,
    fiatCurrency: 'NGN',
    status: 'completed',
    createdAt: new Date().toISOString(),
    reference: `TW-${String(Date.now()).slice(-8)}`
  };

  if (typeof addTransaction === 'function') {
    addTransaction(currentUser, transactionRecord);
  } else {
    const existing = JSON.parse(localStorage.getItem('transwallet_transactions') || '[]');
    localStorage.setItem('transwallet_transactions', JSON.stringify([transactionRecord, ...existing]));
  }

  const successAmountLine = document.getElementById('successAmountLine');
  const successRecipient = document.getElementById('successRecipient');
  const successBank = document.getElementById('successBank');
  const successReference = document.getElementById('successReference');

  if (successAmountLine) successAmountLine.textContent = `${formatNaira(amount)} sent successfully`;
  if (successRecipient) successRecipient.textContent = activeReview.recipient;
  if (successBank) successBank.textContent = activeReview.bank;
  if (successReference) successReference.textContent = transactionRecord.reference;

  updateLandingBalance();
  resetLocalTransferState();
  toggleTransferView('successView');
}

function initTransferFlow() {
  updateLandingBalance();
  renderBankOptions();

  const transferOptions = document.querySelectorAll('.transfer-option');
  transferOptions.forEach((option) => {
    option.addEventListener('click', () => {
      currentTransferType = option.dataset.transferType;
      if (currentTransferType === 'local') {
        resetLocalTransferState();
        toggleTransferView('localTransferView');
      } else {
        renderGlobalFX();
        toggleTransferView('globalTransferView');
      }
    });
  });

  const backButtons = document.querySelectorAll('[data-action]');
  backButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'back-to-home') {
        toggleTransferView('transferLanding');
      }
      if (action === 'back-to-local') {
        toggleTransferView('localTransferView');
      }
      if (action === 'back-to-review') {
        toggleTransferView('reviewTransferView');
      }
    });
  });

  const accountNumberInput = document.getElementById('accountNumber');
  if (accountNumberInput) {
    accountNumberInput.addEventListener('input', () => {
      const digits = accountNumberInput.value.replace(/\D/g, '').slice(0, 10);
      accountNumberInput.value = digits;
      updateAsideSummary();
    });
  }

  const bankSearch = document.getElementById('bankSearch');
  if (bankSearch) {
    bankSearch.addEventListener('input', (event) => {
      renderBankOptions(event.target.value);
    });
  }

  const verifyButton = document.getElementById('accountNumber');
  verifyButton?.addEventListener('blur', () => {
    if (selectedBank && String(document.getElementById('accountNumber')?.value || '').length >= 10) {
      simulateRecipientVerification();
    }
  });

  document.getElementById('retryVerificationBtn')?.addEventListener('click', () => {
    recipientState = null;
    document.getElementById('verificationFailure')?.classList.add('hidden');
    document.getElementById('accountNumber')?.focus();
  });

  document.getElementById('transferAmount')?.addEventListener('input', () => {
    const valid = validateTransferAmount();
    if (valid) {
      buildReviewSummary();
    }
    updateAsideSummary();
  });

  document.getElementById('continueToReviewBtn')?.addEventListener('click', () => {
    if (!validateTransferAmount()) return;
    buildReviewSummary();
    toggleTransferView('reviewTransferView');
  });

  document.getElementById('confirmTransferBtn')?.addEventListener('click', () => {
    if (!activeReview) return;
    openUserPin();
  });

  document.getElementById('submitPinBtn')?.addEventListener('click', () => {
    if (!verifyPin()) return;
    toggleTransferView('processingView');
    window.setTimeout(() => {
      completeTransfer();
    }, 1200);
  });

  document.getElementById('doneTransferBtn')?.addEventListener('click', () => {
    toggleTransferView('transferLanding');
    resetLocalTransferState();
  });

  document.getElementById('globalAmount')?.addEventListener('input', renderGlobalFX);
  document.getElementById('globalFromCurrency')?.addEventListener('change', renderGlobalFX);

  document.getElementById('globalTransferContinueBtn')?.addEventListener('click', () => {
    renderGlobalFX();
    toggleTransferView('transferLanding');
  });

  const pinBoxes = document.querySelectorAll('.pin-box');
  pinBoxes.forEach((box, index) => {
    box.addEventListener('input', (event) => {
      const value = event.target.value.replace(/\D/g, '').slice(0, 1);
      event.target.value = value;
      if (value && index < pinBoxes.length - 1) {
        pinBoxes[index + 1].focus();
      }
    });
    box.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !box.value && index > 0) {
        pinBoxes[index - 1].focus();
      }
    });
  });

  document.getElementById('accountNumber')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && selectedBank && String(document.getElementById('accountNumber')?.value || '').length >= 10) {
      simulateRecipientVerification();
    }
  });

  document.getElementById('retryVerificationBtn')?.addEventListener('click', () => {
    document.getElementById('verificationFailure')?.classList.add('hidden');
    document.getElementById('accountNumber')?.focus();
  });
}

document.addEventListener('DOMContentLoaded', initTransferFlow);
