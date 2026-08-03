/*
Project: Trans Wallet Project
File Purpose: Shared helper utilities
Author Placeholder: Frontend Engineer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Common formatting and DOM helper methods.
*/

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function createElement(tagName, className = '') {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  return element;
}

export { formatCurrency, createElement };
