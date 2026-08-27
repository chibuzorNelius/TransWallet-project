const CRYPTO_NOTIFICATIONS_KEY = 'transwallet_notifications';
const DISMISSED_NOTIFICATIONS_KEY = 'transwallet_dismissed_notifications';

function readNotificationState(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

function getNotificationUserId() {
  try {
    return JSON.parse(localStorage.getItem('current_user') || 'null')?.id || 'USR-0001';
  } catch (error) {
    return 'USR-0001';
  }
}

function dismissNotification(notificationId, element) {
  const dismissed = readNotificationState(DISMISSED_NOTIFICATIONS_KEY);
  if (!dismissed.includes(notificationId)) {
    dismissed.push(notificationId);
    localStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(dismissed));
    sessionStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(dismissed));
  }
  element.classList.remove('crypto-notification-visible');
  setTimeout(() => element.remove(), 220);
}

function showCryptoNotification(notification) {
  const element = document.createElement('aside');
  element.className = 'crypto-notification';
  element.setAttribute('aria-label', notification.title);
  element.innerHTML = `<button class="crypto-notification-close" type="button" aria-label="Close notification">×</button><div class="crypto-notification-icon">✓</div><div><strong>${notification.title}</strong><p>${notification.message}</p><button class="crypto-notification-action" type="button">Close</button></div>`;
  document.body.appendChild(element);
  element.querySelector('.crypto-notification-close').addEventListener('click', () => dismissNotification(notification.id, element));
  element.querySelector('.crypto-notification-action').addEventListener('click', () => dismissNotification(notification.id, element));
  requestAnimationFrame(() => element.classList.add('crypto-notification-visible'));
}

function initCryptoNotifications() {
  const userId = getNotificationUserId();
  const dismissed = readNotificationState(DISMISSED_NOTIFICATIONS_KEY);
  const notification = readNotificationState(CRYPTO_NOTIFICATIONS_KEY).find((entry) => entry.userId === userId && entry.title === 'Crypto Purchase Completed' && !dismissed.includes(entry.id));
  if (notification) showCryptoNotification(notification);
}

document.addEventListener('DOMContentLoaded', initCryptoNotifications);
