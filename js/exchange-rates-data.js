/*
 * Shared demo exchange-rate registry.
 * Exchange Rate and Dashboard read this same source so displayed quotes stay consistent.
 */
(function exposeExchangeRates(global) {
  const currencies = {
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '../images/usaFlag.png', baseRate: 1 },
    NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '\u20a6', flag: '../images/nigeriaFlag.png', baseRate: 1600 },
    EUR: { code: 'EUR', name: 'Euro', symbol: '\u20ac', flag: '../images/EURFLAG.png', baseRate: 0.92 },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '\u00a3', flag: '../images/britishflag.png', baseRate: 0.78 },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '../images/canadaflag.png', baseRate: 1.36 },
    AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '', baseRate: 1.52 },
    JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '\u00a5', flag: '../images/JapanFlag.png', baseRate: 154 },
    CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '', baseRate: 0.89 }
  };

  const movements = {
    'USD/NGN': 0.45,
    'EUR/NGN': -0.18,
    'GBP/NGN': 0.63,
    'USD/EUR': 0.21,
    'GBP/USD': -0.12,
    'CAD/NGN': -0.15
  };

  function getRate(from, to) {
    return currencies[to].baseRate / currencies[from].baseRate;
  }

  function formatAmount(amount, currency) {
    return `${currencies[currency].symbol}${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  global.TransWalletRates = { currencies, movements, getRate, formatAmount };
})(window);
