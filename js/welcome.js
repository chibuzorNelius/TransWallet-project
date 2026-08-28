document.addEventListener('DOMContentLoaded', () => {
  try {
    const session = JSON.parse(localStorage.getItem('transwallet_user_session') || 'null');
    const users = JSON.parse(localStorage.getItem('transwallet_users') || '[]');
    const user = users.find((entry) => entry.id === session?.userId);
    if (!user) window.location.replace('login.html');
    else document.getElementById('welcomeHeading').textContent = `Welcome to TransWallet, ${(user.fullName || user.name).split(' ')[0]}`;
  } catch (error) { window.location.replace('login.html'); }
});
