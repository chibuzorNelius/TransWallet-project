function initExchange() {
  const data = window.TransWalletRates;
  if (!data) return;
  const elements = {
    from: document.getElementById('from-currency'), to: document.getElementById('to-currency'), amount: document.getElementById('amount'),
    converted: document.getElementById('converted-amount'), fromSymbol: document.getElementById('from-symbol'), toSymbol: document.getElementById('to-symbol'),
    fromFlag: document.getElementById('from-flag'), toFlag: document.getElementById('to-flag'), summary: document.getElementById('rate-summary'), market: document.getElementById('market-list'), cards: document.getElementById('currency-cards'), updated: document.getElementById('last-updated')
  };
  const codes = Object.keys(data.currencies);
  const optionMarkup = codes.map((code) => `<option value="${code}">${data.currencies[code].flag}  ${code} · ${data.currencies[code].name}</option>`).join('');
  elements.from.innerHTML = optionMarkup; elements.to.innerHTML = optionMarkup;
  elements.from.value = 'USD'; elements.to.value = 'NGN';

  function renderConverter() {
    const from = data.currencies[elements.from.value]; const to = data.currencies[elements.to.value];
    const amount = Math.max(0, Number(elements.amount.value) || 0); const rate = data.getRate(from.code, to.code); const converted = amount * rate;
    elements.converted.textContent = converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    elements.fromSymbol.textContent = from.symbol; elements.toSymbol.textContent = to.symbol;
    elements.fromFlag.textContent = from.flag; elements.toFlag.textContent = to.flag;
    elements.summary.textContent = `1 ${from.code} = ${rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to.code}`;
  }
  function renderMarkets() {
    const pairs = ['USD/NGN', 'EUR/NGN', 'GBP/NGN', 'USD/EUR'];
    elements.market.innerHTML = pairs.map((pair) => { const [from, to] = pair.split('/'); const movement = data.movements[pair]; return `<button class="market-row" type="button" data-pair="${pair}"><span class="pair-mark">${data.currencies[from].flag}<i>→</i>${data.currencies[to].flag}</span><span><strong>${pair}</strong><small>1 ${from} = ${data.getRate(from, to).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${to}</small></span><span class="movement ${movement >= 0 ? 'positive' : 'negative'}">${movement >= 0 ? '↑ +' : '↓ '}${movement.toFixed(2)}%</span></button>`; }).join('');
    elements.market.querySelectorAll('[data-pair]').forEach((button) => button.addEventListener('click', () => { const [from, to] = button.dataset.pair.split('/'); elements.from.value = from; elements.to.value = to; renderConverter(); document.querySelector('.converter-panel').scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
  }
  function renderCards() {
    const codesToShow = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'JPY'];
    elements.cards.innerHTML = codesToShow.map((code) => { const currency = data.currencies[code]; const movement = data.movements[`${code}/NGN`] || data.movements['USD/EUR']; return `<button class="currency-card" type="button" data-currency="${code}"><span class="card-flag">${currency.flag}</span><span class="card-code">${code}</span><small>${currency.name}</small><strong>${currency.symbol}${data.getRate(code, 'NGN').toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong><span class="${movement >= 0 ? 'positive' : 'negative'}">${movement >= 0 ? '↑ +' : '↓ '}${movement.toFixed(2)}%</span></button>`; }).join('');
    elements.cards.querySelectorAll('[data-currency]').forEach((card) => card.addEventListener('click', () => { elements.from.value = card.dataset.currency; elements.to.value = 'NGN'; renderConverter(); }));
  }
  [elements.from, elements.to, elements.amount].forEach((element) => element.addEventListener('input', renderConverter));
  document.getElementById('swap-currencies').addEventListener('click', () => { const currentFrom = elements.from.value; elements.from.value = elements.to.value; elements.to.value = currentFrom; document.getElementById('swap-currencies').classList.add('is-swapping'); window.setTimeout(() => document.getElementById('swap-currencies').classList.remove('is-swapping'), 350); renderConverter(); });
  renderConverter(); renderMarkets(); renderCards();
  window.setInterval(() => { const now = new Date(); elements.updated.textContent = `Updated ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; }, 30000);
}

document.addEventListener('DOMContentLoaded', initExchange);
