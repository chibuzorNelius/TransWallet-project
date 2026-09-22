

const BANKS = [
  { id: 'access', name: 'Access Bank', code: '044', logo: 'accessBankLogo.png' },
  { id: 'gtbank', name: 'GTBank', code: '058', logo: 'GTA-bankLogo.png' },
  { id: 'firstbank', name: 'FirstBank', code: '011', logo: 'first-bank logo.png' },
  { id: 'uba', name: 'UBA', code: '033', logo: 'UBAbankLogo.png' },
  { id: 'zenith', name: 'Zenith Bank', code: '057', logo: 'zenethBankLogo.png' },
  { id: 'fidelity', name: 'Fidelity Bank', code: '070', logo: 'fidelityBankLogo.png' },
  { id: 'sterling', name: 'Sterling Bank', code: '232', logo: 'sterlingBankLogo.png' },
  { id: 'union', name: 'Union Bank', code: '032', logo: 'unionBankLogo.png' }
];

const GLOBAL_BANKS = {
  US: [
    { name: 'Bank of America', logo: 'usaFlag.png' },
    { name: 'Chase', logo: 'usaFlag.png' }
  ],
  GB: [
    { name: 'Barclays', logo: 'britishflag.png' },
    { name: 'HSBC UK', logo: 'britishflag.png' }
  ],
  CA: [
    { name: 'TD Canada Trust', logo: 'canadaflag.png' },
    { name: 'Royal Bank of Canada', logo: 'canadaflag.png' }
  ],
  GH: [
    { name: 'GCB Bank', logo: 'GhanaFlag.png' },
    { name: 'Ecobank Ghana', logo: 'GhanaFlag.png' }
  ],
  AE: [
    { name: 'Emirates NBD', logo: 'AEflag.png' },
    { name: 'First Abu Dhabi Bank', logo: 'AEflag.png' }
  ]
};

const GLOBAL_COUNTRIES = {
  US: { name: 'United States', flag: 'usaFlag.png' },
  GB: { name: 'United Kingdom', flag: 'britishflag.png' },
  CA: { name: 'Canada', flag: 'canadaflag.png' },
  GH: { name: 'Ghana', flag: 'GMP FLAG.png' },
  AE: { name: 'United Arab Emirates', flag: 'AEflag.png' }
};

const COUNTRY_TO_CURRENCY = {
  US: 'USD',
  GB: 'GBP',
  CA: 'CAD',
  GH: 'GHS',
  AE: 'AED'
};

const CURRENCY_TO_COUNTRY = Object.fromEntries(Object.entries(COUNTRY_TO_CURRENCY).map(([country, currency]) => [currency, country]));

const DEMO_RECIPIENTS = [
  'Chibuzor Nelius',
  'Philip Chidera',
  'mazeed',
  'Ezekiel Ojo',
  'Lucy Upiopio',
  'Comfort Eze',
  'treasure mary',
  'Kolawole',
  'clitton Chibuzor',
  'Chinaza Joy'
];

let currentTransferType = 'local';
let selectedBank = null;
let recipientState = null;
let activeTransferAmount = 0;
let activeReview = null;
let activeGlobalReview = null;

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
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const balance = document.getElementById('landingBalance');
  if (balance) balance.textContent = formatNaira(getCurrentUserBalance());
  const accountName = document.getElementById('landingAccountName');
  const accountNumber = document.getElementById('landingAccountNumber');
  if (accountName) accountName.textContent = user?.fullName || user?.name || user?.username || 'TransWallet account';
  if (accountNumber) accountNumber.textContent = user?.accountNumber || 'Account number unavailable';
  const ratePreview = document.getElementById('landingRatePreview');
  const rate = window.TransWalletExchange?.getExchangeRate?.('USD', 'NGN') || 1600;
  if (ratePreview) ratePreview.textContent = `1 USD = ${formatNaira(rate)}`;
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
      <span class="bank-logo"><img src="../images/${bank.logo}" alt="" /></span>
      <span class="bank-name">${bank.name}<small>Nigeria · ${bank.code}</small></span>
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

function getCurrencyForCountry(countryCode = 'US') {
  return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
}

function getCountryForCurrency(currencyCode = 'USD') {
  return CURRENCY_TO_COUNTRY[currencyCode] || 'US';
}

function syncGlobalCurrencyToCountry(countryCode = 'US') {
  const currencySelect = document.getElementById('globalFromCurrency');
  if (!currencySelect) return;

  const nextCurrency = getCurrencyForCountry(countryCode || 'US');
  if (currencySelect.value !== nextCurrency) {
    currencySelect.value = nextCurrency;
  }
}

function syncGlobalCountryToCurrency(currencyCode = 'USD') {
  const countrySelect = document.getElementById('globalCountry');
  if (!countrySelect) return;

  const nextCountry = getCountryForCurrency(currencyCode || 'USD');
  if (countrySelect.value !== nextCountry) {
    countrySelect.value = nextCountry;
  }
}

function renderGlobalBanks() {
  const country = document.getElementById('globalCountry')?.value || 'US';
  const bankSelect = document.getElementById('globalBank');
  if (!bankSelect) return;
  bankSelect.innerHTML = (GLOBAL_BANKS[country] || []).map((bank) => `<option value="${bank.name}" data-logo="${bank.logo}">${bank.name}</option>`).join('');
  const selectedBank = GLOBAL_BANKS[country]?.[0];
  const bankPreview = document.getElementById('globalBankPreview');
  if (bankPreview && selectedBank) bankPreview.innerHTML = `<img src="../images/${selectedBank.logo}" alt="" /><span><strong>${selectedBank.name}</strong><small>${GLOBAL_COUNTRIES[country].name}</small></span>`;
  const countryData = GLOBAL_COUNTRIES[country];
  const flag = document.getElementById('globalReviewFlag');
  if (flag && countryData) flag.innerHTML = `<img src="../images/${countryData.flag}" alt="${countryData.name} flag" />`;
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
  const currencySelect = document.getElementById('globalFromCurrency');
  const countrySelect = document.getElementById('globalCountry');
  const fromCurrency = currencySelect?.value || getCurrencyForCountry(countrySelect?.value || 'US');
  const safeFromCurrency = fromCurrency || 'USD';
  const amountInput = document.getElementById('globalAmount');
  const amount = Number(amountInput?.value || 0);
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const fxRate = window.TransWalletExchange?.getRateSummary?.(safeAmount, safeFromCurrency, 'NGN') || { rate: 0, converted: 0 };

  const fromAmount = document.getElementById('fxFromAmount');
  const rateLine = document.getElementById('fxRateLine');
  const recipientAmount = document.getElementById('fxRecipientAmount');

  if (currencySelect && currencySelect.value !== safeFromCurrency) {
    currencySelect.value = safeFromCurrency;
  }

  if (countrySelect && countrySelect.value !== getCountryForCurrency(safeFromCurrency)) {
    countrySelect.value = getCountryForCurrency(safeFromCurrency);
  }

  if (fromAmount) fromAmount.textContent = `${safeFromCurrency} ${safeAmount.toFixed(2)}`;
  if (rateLine) rateLine.textContent = `1 ${safeFromCurrency} = ${formatNaira(fxRate.rate || 0)}`;
  if (recipientAmount) recipientAmount.textContent = formatNaira(fxRate.converted || 0);

  const isValidAmount = safeAmount > 0 && Number.isFinite(fxRate.converted) && fxRate.converted <= getCurrentUserBalance();
  document.getElementById('globalAmountError')?.classList.toggle('hidden', isValidAmount || !safeAmount);
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

function buildGlobalReview() {
  const countryCode = document.getElementById('globalCountry')?.value || 'US';
  const country = GLOBAL_COUNTRIES[countryCode];
  const currency = document.getElementById('globalFromCurrency')?.value || 'USD';
  const amount = Number(document.getElementById('globalAmount')?.value || 0);
  const fx = window.TransWalletExchange?.getRateSummary?.(amount, currency, 'NGN');
  const recipient = document.getElementById('globalRecipientName')?.value.trim();
  const accountNumber = document.getElementById('globalAccountNumber')?.value.trim();
  const bank = document.getElementById('globalBank')?.value;
  if (!recipient || !accountNumber || !bank || !amount || !fx || fx.converted > getCurrentUserBalance()) return false;
  activeGlobalReview = { countryCode, country: country.name, currency, amount, converted: fx.converted, recipient, accountNumber, bank };
  document.getElementById('globalReviewRecipient').textContent = recipient;
  document.getElementById('globalReviewDestination').textContent = country.name;
  document.getElementById('globalReviewBank').textContent = bank;
  document.getElementById('globalReviewAccount').textContent = maskAccountNumber(accountNumber);
  document.getElementById('globalReviewAmount').textContent = `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('globalReviewReceive').textContent = formatNaira(fx.converted);
  return true;
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
  const isGlobal = Boolean(activeGlobalReview);
  const amount = isGlobal ? Number(activeGlobalReview.converted || 0) : Number(activeReview?.amount || 0);
  const review = isGlobal ? activeGlobalReview : activeReview;
  if (!currentUser || !review || !amount) return;

  const nextBalance = Number(currentUser.balance || 0) - amount;
  currentUser.balance = Math.max(0, nextBalance);
  if (typeof updateUser === 'function') {
    updateUser(currentUser);
  }

  const transactionRecord = {
    id: `TX-${Date.now()}`,
    userId: currentUser.id,
    type: 'transfer',
    description: isGlobal ? `International transfer to ${review.recipient}` : `Send Money to ${review.recipient}`,
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

  const adminActivity = JSON.parse(localStorage.getItem('transwallet_admin_activity') || '[]');
  adminActivity.unshift({ id: `ACT-${Date.now()}`, message: `${isGlobal ? 'International' : 'Local'} transfer ${transactionRecord.reference} completed for ${currentUser.fullName || currentUser.name || currentUser.username}.`, createdAt: transactionRecord.createdAt });
  localStorage.setItem('transwallet_admin_activity', JSON.stringify(adminActivity));

  const successAmountLine = document.getElementById('successAmountLine');
  const successRecipient = document.getElementById('successRecipient');
  const successBank = document.getElementById('successBank');
  const successReference = document.getElementById('successReference');

  if (isGlobal) {
    document.getElementById('globalSuccessLine').textContent = `${review.currency} ${review.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} sent successfully`;
    document.getElementById('globalSuccessRecipient').textContent = review.recipient;
    document.getElementById('globalSuccessDestination').textContent = review.country;
    document.getElementById('globalSuccessReference').textContent = transactionRecord.reference;
  } else {
    if (successAmountLine) successAmountLine.textContent = `${formatNaira(amount)} sent successfully`;
    if (successRecipient) successRecipient.textContent = review.recipient;
    if (successBank) successBank.textContent = review.bank;
  }
  if (successReference) successReference.textContent = transactionRecord.reference;

  updateLandingBalance();
  resetLocalTransferState();
  activeGlobalReview = null;
  toggleTransferView(isGlobal ? 'globalSuccessView' : 'successView');
}

function initTransferFlow() {
  updateLandingBalance();
  renderBankOptions();

  const hashMode = window.location.hash.replace('#', '');
  if (hashMode === 'globalTransfer') {
    currentTransferType = 'global';
    const countrySelect = document.getElementById('globalCountry');
    const currencySelect = document.getElementById('globalFromCurrency');
    if (countrySelect) {
      countrySelect.value = 'US';
    }
    if (currencySelect) {
      currencySelect.value = 'USD';
    }
    renderGlobalBanks();
    renderGlobalFX();
    toggleTransferView('globalTransferView');
  }

  const transferOptions = document.querySelectorAll('.transfer-option');
  transferOptions.forEach((option) => {
    option.addEventListener('click', () => {
      currentTransferType = option.dataset.transferType;
      if (currentTransferType === 'local') {
        resetLocalTransferState();
        toggleTransferView('localTransferView');
      } else {
        renderGlobalBanks();
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
      if (action === 'back-to-global') {
        toggleTransferView('globalTransferView');
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

  document.getElementById('globalDoneTransferBtn')?.addEventListener('click', () => {
    toggleTransferView('transferLanding');
  });

  document.getElementById('globalAmount')?.addEventListener('input', renderGlobalFX);
  document.getElementById('globalFromCurrency')?.addEventListener('change', (event) => {
    const selectedCurrency = event.target.value || 'USD';
    syncGlobalCountryToCurrency(selectedCurrency);
    renderGlobalBanks();
    renderGlobalFX();
  });
  document.getElementById('globalCountry')?.addEventListener('change', (event) => {
    const selectedCountry = event.target.value || 'US';
    syncGlobalCurrencyToCountry(selectedCountry);
    renderGlobalBanks();
    renderGlobalFX();
  });
  document.getElementById('globalBank')?.addEventListener('change', (event) => {
    const bank = GLOBAL_BANKS[document.getElementById('globalCountry')?.value || 'US']?.find((entry) => entry.name === event.target.value);
    const preview = document.getElementById('globalBankPreview');
    if (preview && bank) preview.innerHTML = `<img src="../images/${bank.logo}" alt="" /><span><strong>${bank.name}</strong><small>${GLOBAL_COUNTRIES[document.getElementById('globalCountry')?.value || 'US'].name}</small></span>`;
  });

  document.getElementById('globalTransferContinueBtn')?.addEventListener('click', () => {
    renderGlobalFX();
    if (buildGlobalReview()) toggleTransferView('globalReviewView');
  });

  document.getElementById('globalConfirmTransferBtn')?.addEventListener('click', () => {
    if (activeGlobalReview) openUserPin();
  });

  document.getElementById('copyTransferAccountBtn')?.addEventListener('click', async (event) => {
    const accountNumber = document.getElementById('landingAccountNumber')?.textContent;
    if (!accountNumber || accountNumber.includes('unavailable')) return;
    try { await navigator.clipboard.writeText(accountNumber); } catch (error) { return; }
    event.currentTarget.textContent = 'Copied';
    window.setTimeout(() => { event.currentTarget.textContent = 'Copy'; }, 1600);
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
