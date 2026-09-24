const fs = require('fs');
const vm = require('vm');

const elements = new Map();
const ensure = (id) => {
  if (!elements.has(id)) {
    elements.set(id, {
      id,
      value: '',
      textContent: '',
      innerHTML: '',
      dataset: {},
      disabled: false,
      checked: false,
      style: {},
      classList: {
        add() {},
        remove() {},
        toggle() {},
        contains() { return false; }
      },
      addEventListener() {},
      focus() {},
      querySelectorAll() { return []; }
    });
  }
  return elements.get(id);
};

const context = {
  window: {},
  document: {
    querySelectorAll: () => [],
    getElementById: (id) => ensure(id),
    addEventListener() {}
  },
  localStorage: {
    data: {},
    getItem(key) { return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null; },
    setItem(key, value) { this.data[key] = String(value); },
    removeItem(key) { delete this.data[key]; }
  },
  navigator: { clipboard: {} },
  console,
  setTimeout,
  clearTimeout,
  Intl,
  Date,
  JSON,
  Number,
  String,
  Math,
  Array,
  Object,
  RegExp,
  parseFloat,
  parseInt
};
context.window = context;
context.globalThis = context;
context.getCurrentUser = () => ({ id: 'u1', balance: 250000, fullName: 'Jane Doe', name: 'Jane Doe', username: 'jane', transactionPin: '1234' });

vm.runInNewContext(fs.readFileSync('js/exchange-rates-data.js', 'utf8'), context);
vm.runInNewContext(fs.readFileSync('js/exchange-rate.js', 'utf8'), context);
vm.runInNewContext(fs.readFileSync('js/transfer.js', 'utf8'), context);

const fx = context.getExchangeRate('USD', 'NGN');
const summary = context.getRateSummary(100, 'USD', 'NGN');
ensure('globalCountry').value = 'US';
ensure('globalFromCurrency').value = 'USD';
ensure('globalAmount').value = '100';
const state = context.getGlobalTransferState();
context.renderGlobalFX();

const checks = [
  ['USD->NGN rate', fx, 1600],
  ['summary converted 100 USD', summary.converted, 160000],
  ['global deduction 100 USD', state.localDeduction, 160000],
  ['fx charge UI', ensure('fxChargeAmount').textContent, '₦160,000.00'],
  ['fx rate UI', ensure('fxRateLine').textContent, '1 USD = ₦1,600'],
  ['fx amount UI', ensure('fxFromAmount').textContent, 'USD 100.00']
];

for (const [label, actual, expected] of checks) {
  if (actual !== expected) {
    throw new Error(`${label} failed: expected ${expected}, got ${actual}`);
  }
}

console.log('VERIFICATION PASS');
for (const [label, actual] of checks) {
  console.log(`${label}: ${actual}`);
}
