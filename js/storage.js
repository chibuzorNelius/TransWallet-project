/*
Project: Trans Wallet Project
File Purpose: Simulated storage helpers
Author Placeholder: Frontend Engineer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-03
Description: Lightweight local storage wrapper for project state.
*/

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadState(key, fallback = null) {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : fallback;
}

function clearState(key) {
  localStorage.removeItem(key);
}

export { saveState, loadState, clearState };
