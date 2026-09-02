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
}

document.addEventListener('DOMContentLoaded', initExchange);
