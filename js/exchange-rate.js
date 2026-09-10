<<<<<<< HEAD
/*
Project: Trans Wallet Project
File Purpose: Exchange simulation logic
Author Placeholder: Exchange Developer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Shared FX data, currency conversion logic, and quote helpers used across the product.
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
  const rates = readRates();
  const fromRate = Number(rates[fromCurrency] || 1);
  const toRate = Number(rates[toCurrency] || 1);

  if (fromCurrency === toCurrency) return 1;
  if (fromCurrency === 'NGN') return 1 / toRate;
  if (toCurrency === 'NGN') return fromRate;

  return (fromRate / toRate) * 1;
}

function convertCurrency(amount, fromCurrency = 'USD', toCurrency = 'NGN') {
  const safeAmount = Number(amount || 0);
  const rate = getExchangeRate(fromCurrency, toCurrency);
  return safeAmount * rate;
}

function formatCurrency(value, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
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
  formatCurrency,
  getRateSummary,
  readRates
};

function initExchange() {
  if (!localStorage.getItem(EXCHANGE_RATES_KEY)) {
    localStorage.setItem(EXCHANGE_RATES_KEY, JSON.stringify(DEFAULT_EXCHANGE_RATES));
  }
=======
function initExchange() {
  const data = window.TransWalletRates;
  if (!data) return;
  const elements = {
    from: document.getElementById('from-currency'), to: document.getElementById('to-currency'), amount: document.getElementById('amount'),
    converted: document.getElementById('converted-amount'), fromSymbol: document.getElementById('from-symbol'), toSymbol: document.getElementById('to-symbol'),
    fromFlag: document.getElementById('from-flag'), toFlag: document.getElementById('to-flag'), summary: document.getElementById('rate-summary'), market: document.getElementById('market-list'), cards: document.getElementById('currency-cards'), updated: document.getElementById('last-updated')
  };
  const codes = Object.keys(data.currencies);
  const optionMarkup = codes.map((code) => `<option value="${code}">${code} · ${data.currencies[code].name}</option>`).join('');
  elements.from.innerHTML = optionMarkup; elements.to.innerHTML = optionMarkup;
  elements.from.value = 'USD'; elements.to.value = 'NGN';

  function renderConverter() {
    const from = data.currencies[elements.from.value]; const to = data.currencies[elements.to.value];
    const amount = Math.max(0, Number(elements.amount.value) || 0); const rate = data.getRate(from.code, to.code); const converted = amount * rate;
    elements.converted.textContent = converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    elements.fromSymbol.textContent = from.symbol; elements.toSymbol.textContent = to.symbol;
    elements.fromFlag.innerHTML = from.flag ? `<img src="${from.flag}" alt="${from.name} flag" />` : '';
    elements.toFlag.innerHTML = to.flag ? `<img src="${to.flag}" alt="${to.name} flag" />` : '';
    elements.summary.textContent = `1 ${from.code} = ${rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to.code}`;
  }
  function renderMarkets() {
    const pairs = ['USD/NGN', 'EUR/NGN', 'GBP/NGN', 'USD/EUR'];
    elements.market.innerHTML = pairs.map((pair) => { const [from, to] = pair.split('/'); const movement = data.movements[pair]; return `<button class="market-row" type="button" data-pair="${pair}"><span class="pair-mark"><img src="${data.currencies[from].flag}" alt="${data.currencies[from].name} flag" /><i>→</i><img src="${data.currencies[to].flag}" alt="${data.currencies[to].name} flag" /></span><span><strong>${pair}</strong><small>1 ${from} = ${data.getRate(from, to).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${to}</small></span><span class="movement ${movement >= 0 ? 'positive' : 'negative'}">${movement >= 0 ? '↑ +' : '↓ '}${movement.toFixed(2)}%</span></button>`; }).join('');
    elements.market.querySelectorAll('[data-pair]').forEach((button) => button.addEventListener('click', () => { const [from, to] = button.dataset.pair.split('/'); elements.from.value = from; elements.to.value = to; renderConverter(); document.querySelector('.converter-panel').scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
  }
  function renderCards() {
    const codesToShow = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'JPY'];
    elements.cards.innerHTML = codesToShow.map((code) => { const currency = data.currencies[code]; const movement = data.movements[`${code}/NGN`] || data.movements['USD/EUR']; const flagMarkup = currency.flag ? `<img src="${currency.flag}" alt="${currency.name} flag" />` : ''; return `<button class="currency-card" type="button" data-currency="${code}"><span class="card-flag">${flagMarkup}</span><span class="card-code">${code}</span><small>${currency.name}</small><strong>${currency.symbol}${data.getRate(code, 'NGN').toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong><span class="${movement >= 0 ? 'positive' : 'negative'}">${movement >= 0 ? '↑ +' : '↓ '}${movement.toFixed(2)}%</span></button>`; }).join('');
    elements.cards.querySelectorAll('[data-currency]').forEach((card) => card.addEventListener('click', () => { elements.from.value = card.dataset.currency; elements.to.value = 'NGN'; renderConverter(); }));
  }
  [elements.from, elements.to, elements.amount].forEach((element) => element.addEventListener('input', renderConverter));
  document.getElementById('swap-currencies').addEventListener('click', () => { const currentFrom = elements.from.value; elements.from.value = elements.to.value; elements.to.value = currentFrom; document.getElementById('swap-currencies').classList.add('is-swapping'); window.setTimeout(() => document.getElementById('swap-currencies').classList.remove('is-swapping'), 350); renderConverter(); });
  renderConverter(); renderMarkets(); renderCards();
  window.setInterval(() => { const now = new Date(); elements.updated.textContent = `Updated ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; }, 30000);
>>>>>>> aec51dfb55cfa9e2741ea4c9aee1081cdc9cedb4
}

document.addEventListener('DOMContentLoaded', initExchange);
