/* Keep the compact dashboard summary aligned with the shared demo registry. */
document.addEventListener('DOMContentLoaded', () => {
  const registry = window.TransWalletRates;
  if (!registry) return;
  document.querySelectorAll('.rate-item').forEach((item) => {
    const code = item.querySelector('.rate-name')?.textContent.trim();
    if (!registry.currencies[code]) return;
    const rate = registry.getRate(code, 'NGN');
    const value = item.querySelector('.rate-val');
    if (value) value.textContent = registry.formatAmount(rate, 'NGN');
    const movement = registry.movements[`${code}/NGN`] || 0;
    const change = item.querySelector('.rate-change');
    if (change) {
      change.classList.toggle('up', movement >= 0);
      change.classList.toggle('down', movement < 0);
      change.textContent = `${movement >= 0 ? '↑' : '↓'} ${Math.abs(movement).toFixed(2)}%`;
    }
  });
});
