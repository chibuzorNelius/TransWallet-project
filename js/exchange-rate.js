/*
Project: Trans Wallet Project
File Purpose: Exchange simulation logic
Author Placeholder: Exchange Developer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Shared FX data, currency conversion logic, and quote helpers used across the product.
.pair-mark
*/

const EXCHANGE_RATES_KEY = 'transwallet_exchange_rates';

const DEFAULT_EXCHANGE_RATES = {
  USD: 1600,
  EUR: 1740,
  GBP: 2010,
  CAD: 1150,
  GHS: 106,
  AED: 435,
  NGN: 1
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  NGN: '₦',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  GHS: 'GH₵',
  AED: 'د.إ',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF'
};

function readRates() {
  try {
    const storedRates = JSON.parse(localStorage.getItem(EXCHANGE_RATES_KEY) || 'null');
    if (storedRates && typeof storedRates === 'object') {
      return { ...DEFAULT_EXCHANGE_RATES, ...storedRates };
    }
  } catch (error) {
    console.info('Using default exchange rates');
  }

  localStorage.setItem(EXCHANGE_RATES_KEY, JSON.stringify(DEFAULT_EXCHANGE_RATES));
  return { ...DEFAULT_EXCHANGE_RATES };
}

function getExchangeRate(fromCurrency = 'USD', toCurrency = 'NGN') {
  const registry = window.TransWalletRates && window.TransWalletRates.currencies ? window.TransWalletRates.currencies : null;
  const baseRates = registry ? Object.fromEntries(
    Object.entries(registry).map(([code, item]) => [code, Number(item.baseRate || 1)])
  ) : readRates();
  const fromRate = Number(baseRates[fromCurrency] || 1);
  const toRate = Number(baseRates[toCurrency] || 1);

  if (fromCurrency === toCurrency) return 1;
  if (!fromRate || !toRate) return 0;
  return toRate / fromRate;
}

function convertCurrency(amount, fromCurrency = 'USD', toCurrency = 'NGN') {
  const safeAmount = Number(amount || 0);
  const rate = getExchangeRate(fromCurrency, toCurrency);
  return safeAmount * rate;
}

function formatCurrencyValue(value, currency = 'NGN') {
  const resolved = Number(value || 0);
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(resolved)}`;
}

function getRateSummary(amount, fromCurrency = 'USD', toCurrency = 'NGN') {
  const safeAmount = Number(amount || 0);
  const rate = getExchangeRate(fromCurrency, toCurrency);
  const converted = convertCurrency(safeAmount, fromCurrency, toCurrency);
  return { rate, converted, fromCurrency, toCurrency, amount: safeAmount };
}

window.TransWalletExchange = {
  DEFAULT_EXCHANGE_RATES,
  getExchangeRate,
  convertCurrency,
  formatCurrency: formatCurrencyValue,
  getRateSummary,
  readRates
};

function getSupportedCurrencies() {
  const registry = window.TransWalletRates && window.TransWalletRates.currencies ? Object.values(window.TransWalletRates.currencies) : [];
  return registry.filter((currency) => currency && currency.code && (currency.flag || currency.code === 'NGN' || currency.code === 'USD'));
}

function renderCurrencyOptions() {
  const registry = window.TransWalletRates && window.TransWalletRates.currencies ? window.TransWalletRates.currencies : {};
  const currencyEntries = Object.values(registry).filter((currency) => currency && currency.code);

  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  if (!fromSelect || !toSelect) return;

  const optionMarkup = currencyEntries.map((currency) => `<option value="${currency.code}">${currency.code} · ${currency.name}</option>`).join('');
  fromSelect.innerHTML = optionMarkup;
  toSelect.innerHTML = optionMarkup;

  fromSelect.value = 'USD';
  toSelect.value = 'NGN';
}

function renderFlag(element, currencyCode) {
  const entry = window.TransWalletRates && window.TransWalletRates.currencies ? window.TransWalletRates.currencies[currencyCode] : null;
  if (!element) return;

  if (entry && entry.flag) {
    element.innerHTML = `<img src="${entry.flag}" alt="${entry.name} flag" />`;
    return;
  }

  element.textContent = currencyCode || '—';
}

function renderMarkets() {
  const marketList = document.getElementById('market-list');
  if (!marketList) return;

  const pairs = ['USD/NGN', 'EUR/NGN', 'GBP/NGN', 'USD/EUR', 'CAD/NGN', 'GHS/NGN'];
  const registry = window.TransWalletRates && window.TransWalletRates.currencies ? window.TransWalletRates.currencies : {};

  marketList.innerHTML = pairs.map((pair) => {
    const [from, to] = pair.split('/');
    const fromMeta = registry[from];
    const toMeta = registry[to];
    const rate = window.TransWalletRates.getRate(from, to);
    const movement = window.TransWalletRates.movements[pair] || 0;
    const flagMarkup = fromMeta && fromMeta.flag ? `<img src="${fromMeta.flag}" alt="${fromMeta.name} flag" />` : `<span class="mini-code">${from}</span>`;
    const toFlagMarkup = toMeta && toMeta.flag ? `<img src="${toMeta.flag}" alt="${toMeta.name} flag" />` : `<span class="mini-code">${to}</span>`;
    const movementDisplay = movement >= 0 ? `↑ ${Math.abs(movement).toFixed(2)}%` : `↓ ${Math.abs(movement).toFixed(2)}%`;
    return `
      <button type="button" class="market-row" data-pair="${pair}">
        <span class="pair-mark">${flagMarkup}<i>→</i>${toFlagMarkup}</span>
        <span><strong>${pair}</strong><small>1 ${from} = ${rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}</small></span>
        <span class="${movement >= 0 ? 'positive' : 'negative'}">${movementDisplay}</span>
      </button>
    `;
  }).join('');

  marketList.querySelectorAll('[data-pair]').forEach((button) => {
    button.addEventListener('click', () => {
      const [from, to] = button.dataset.pair.split('/');
      const fromSelect = document.getElementById('from-currency');
      const toSelect = document.getElementById('to-currency');
      if (fromSelect) fromSelect.value = from;
      if (toSelect) toSelect.value = to;
      renderConverter();
    });
  });
}

function renderCurrencyCards() {
  const cardTarget = document.getElementById('currency-cards');
  if (!cardTarget) return;

  const registry = window.TransWalletRates && window.TransWalletRates.currencies ? window.TransWalletRates.currencies : {};
  const codesToShow = ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'NGN'];
  cardTarget.innerHTML = codesToShow.map((code) => {
    const item = registry[code];
    if (!item) return '';
    const value = window.TransWalletRates.getRate(code, 'NGN');
    const movement = window.TransWalletRates.movements[`${code}/NGN`] || 0;
    const flagMarkup = item.flag ? `<span class="card-flag"><img src="${item.flag}" alt="${item.name} flag" /></span>` : `<span class="card-flag">${code}</span>`;
    const movementText = movement >= 0 ? `↑ ${Math.abs(movement).toFixed(2)}%` : `↓ ${Math.abs(movement).toFixed(2)}%`;
    return `
      <button type="button" class="currency-card" data-currency="${code}">
        ${flagMarkup}
        <span class="card-code">${code}</span>
        <small>${item.name}</small>
        <strong>${CURRENCY_SYMBOLS[code] || code}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        <span class="${movement >= 0 ? 'positive' : 'negative'}">${movementText}</span>
      </button>
    `;
  }).join('');

  cardTarget.querySelectorAll('[data-currency]').forEach((button) => {
    button.addEventListener('click', () => {
      const fromSelect = document.getElementById('from-currency');
      const toSelect = document.getElementById('to-currency');
      if (fromSelect) fromSelect.value = button.dataset.currency;
      if (toSelect) toSelect.value = 'NGN';
      renderConverter();
    });
  });
}

function renderConverter() {
  const amountInput = document.getElementById('amount');
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  const convertedOutput = document.getElementById('converted-amount');
  const fromSymbol = document.getElementById('from-symbol');
  const toSymbol = document.getElementById('to-symbol');
  const fromFlag = document.getElementById('from-flag');
  const toFlag = document.getElementById('to-flag');
  const summary = document.getElementById('rate-summary');
  const lastUpdated = document.getElementById('last-updated');

  if (!amountInput || !fromSelect || !toSelect || !convertedOutput) return;

  const fromCurrency = fromSelect.value || 'USD';
  const toCurrency = toSelect.value || 'NGN';
  const amount = Math.max(0, Number(amountInput.value) || 0);
  const rate = getExchangeRate(fromCurrency, toCurrency);
  const converted = amount * rate;

  if (fromSymbol) fromSymbol.textContent = CURRENCY_SYMBOLS[fromCurrency] || fromCurrency;
  if (toSymbol) toSymbol.textContent = CURRENCY_SYMBOLS[toCurrency] || toCurrency;
  renderFlag(fromFlag, fromCurrency);
  renderFlag(toFlag, toCurrency);

  const outputValue = Number.isFinite(converted) ? converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
  convertedOutput.textContent = outputValue;
  if (summary) summary.textContent = `1 ${fromCurrency} = ${formatCurrencyValue(rate, toCurrency)} ${toCurrency}`;
  if (lastUpdated) {
    const stamp = new Date();
    lastUpdated.textContent = `Updated ${stamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}

function initExchange() {
  if (!localStorage.getItem(EXCHANGE_RATES_KEY)) {
    localStorage.setItem(EXCHANGE_RATES_KEY, JSON.stringify(DEFAULT_EXCHANGE_RATES));
  }

  renderCurrencyOptions();
  renderMarkets();
  renderCurrencyCards();
  renderConverter();

  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  const amountInput = document.getElementById('amount');
  const swapButton = document.getElementById('swap-currencies');
  const transferButton = document.querySelector('.primary-action');

  if (fromSelect) fromSelect.addEventListener('change', renderConverter);
  if (toSelect) toSelect.addEventListener('change', renderConverter);
  if (amountInput) amountInput.addEventListener('input', renderConverter);

  if (swapButton) {
    swapButton.addEventListener('click', () => {
      if (!fromSelect || !toSelect) return;
      const currentFrom = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = currentFrom;
      swapButton.classList.add('is-swapping');
      window.setTimeout(() => swapButton.classList.remove('is-swapping'), 350);
      renderConverter();
    });
  }

  if (transferButton) {
    transferButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.assign('send-money.html#globalTransfer');
    });
  }
}

document.addEventListener('DOMContentLoaded', initExchange);
