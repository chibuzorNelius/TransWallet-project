const REQUESTS_KEY = 'transwallet_crypto_requests';
const USERS_KEY = 'transwallet_users';
const TRANSACTIONS_KEY = 'transwallet_transactions';
const NOTIFICATIONS_KEY = 'transwallet_notifications';
const ACTIVITY_KEY = 'transwallet_admin_activity';

function readState(key) {
	try {
		const localValue = localStorage.getItem(key);
		const sessionValue = sessionStorage.getItem(key);
		return JSON.parse(localValue || sessionValue || '[]');
	} catch (error) {
		return [];
	}
}

function writeState(key, value) {
	const serialized = JSON.stringify(value);
	sessionStorage.setItem(key, serialized);
	localStorage.setItem(key, serialized);
}

function formatMoney(amount, currency = 'NGN') {
	return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

function maskAddress(address) {
	return address.length > 12 ? `${address.slice(0, 6)}••••${address.slice(-6)}` : address;
}

function getRequests() { return readState(REQUESTS_KEY); }

function getRequestTotal(request) { return Number(request.totalAmount ?? request.fiatAmount ?? 0); }
function getRequestBase(request) { return Number(request.baseAmount ?? getRequestTotal(request)); }
function getRequestFee(request) { return Number(request.serviceFee ?? 0); }

function renderAdminIdentity() {
	const session = readAdminSession();
	if (!session) return;
	const welcome = document.getElementById('adminWelcome');
	const profileName = document.getElementById('adminProfileName');
	const avatar = document.getElementById('adminAvatar');
	if (welcome) welcome.textContent = `Welcome back, ${session.adminName}`;
	if (profileName) profileName.textContent = session.adminName;
	if (avatar) avatar.textContent = session.adminName.slice(0, 2).toUpperCase();
}

function renderOverview() {
	const requests = getRequests();
	const transactions = readState(TRANSACTIONS_KEY);
	const users = readState(USERS_KEY);
	document.getElementById('totalUsers').textContent = users.length;
	document.getElementById('totalTransactions').textContent = transactions.length;
	document.getElementById('pendingRequests').textContent = requests.filter((request) => request.status === 'pending').length;
	document.getElementById('completedTransactions').textContent = transactions.filter((transaction) => transaction.status === 'completed').length;
	document.getElementById('transactionVolume').textContent = formatMoney(transactions.reduce((total, transaction) => total + Math.abs(Number(transaction.fiatAmount || 0)), 0));
	document.getElementById('totalRevenue').textContent = formatMoney(requests.filter((request) => request.status === 'completed').reduce((total, request) => total + getRequestFee(request), 0));
	document.getElementById('navPendingCount').textContent = requests.filter((request) => request.status === 'pending').length;
}

function statusMarkup(status) { return `<span class="status status-${status}">${status}</span>`; }

function renderRequests() {
	const filter = document.getElementById('statusFilter').value;
	const requests = getRequests().filter((request) => filter === 'all' || request.status === filter);
	const body = document.getElementById('requestTableBody');
	const cards = document.getElementById('requestCards');
	document.getElementById('emptyRequests').classList.toggle('hidden', requests.length > 0);
	body.innerHTML = requests.map(request => `<tr><td><strong>${request.id}</strong></td><td>${request.userName}</td><td>${request.asset}</td><td>${request.cryptoAmount} ${request.asset}</td><td>${maskAddress(request.walletAddress)}</td><td>${formatMoney(getRequestTotal(request), request.fiatCurrency)}</td><td>${new Date(request.createdAt).toLocaleString()}</td><td>${statusMarkup(request.status)}</td><td><button class="table-action" data-request-id="${request.id}" type="button">Review</button></td></tr>`).join('');
	cards.innerHTML = requests.map(request => `<article class="request-card"><div class="request-card-top"><strong>${request.id}</strong>${statusMarkup(request.status)}</div><div class="request-card-grid"><span>User<strong>${request.userName}</strong></span><span>Asset<strong>${request.cryptoAmount} ${request.asset}</strong></span><span>Base<strong>${formatMoney(getRequestBase(request), request.fiatCurrency)}</strong></span><span>Fee<strong>${formatMoney(getRequestFee(request), request.fiatCurrency)}</strong></span><span>To pay<strong>${formatMoney(getRequestTotal(request), request.fiatCurrency)}</strong></span><span>Wallet<strong>${maskAddress(request.walletAddress)}</strong></span></div><button class="table-action" data-request-id="${request.id}" type="button">Review request</button></article>`).join('');
}

function renderFeeds() {
	const activity = readState(ACTIVITY_KEY).slice(0, 5);
	document.getElementById('adminActivity').innerHTML = activity.length ? activity.map(entry => `<div class="feed-item"><strong>${entry.message}</strong><span>${new Date(entry.createdAt).toLocaleString()}</span></div>`).join('') : '<p class="empty-state">No admin activity yet.</p>';
	const revenue = getRequests().filter((request) => request.status === 'completed' && getRequestFee(request) > 0);
	document.getElementById('revenueFeed').innerHTML = revenue.length ? revenue.map(request => `<div class="feed-item"><strong>${request.id} · ${request.userName}</strong><span>${formatMoney(getRequestFee(request), request.fiatCurrency)} · ${new Date(request.completedAt || request.createdAt).toLocaleString()}</span></div>`).join('') : '<p class="empty-state">No revenue generated yet.</p>';
}

function renderTransactions() {
	const query = document.getElementById('transactionSearch').value.trim().toLowerCase();
	const status = document.getElementById('transactionStatus').value;
	const transactions = readState(TRANSACTIONS_KEY).filter((transaction) => `${transaction.id} ${transaction.description} ${transaction.reference || ''}`.toLowerCase().includes(query) && (status === 'all' || transaction.status === status));
	document.getElementById('emptyTransactions').classList.toggle('hidden', transactions.length > 0);
	document.getElementById('recentTransactions').innerHTML = transactions.length ? transactions.map(transaction => `<div class="feed-item"><strong>${transaction.description}</strong><span>${transaction.id} · ${formatMoney(transaction.fiatAmount, transaction.fiatCurrency)} · ${transaction.status} · ${new Date(transaction.createdAt).toLocaleString()}</span></div>`).join('') : '';
}

function renderUsers() {
	const search = document.getElementById('userSearch').value.trim().toLowerCase();
	const status = document.getElementById('userStatus').value;
	const users = readState(USERS_KEY).filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(search) && (status === 'all' || (user.status || 'active') === status));
	const requests = getRequests();
	document.getElementById('emptyUsers').classList.toggle('hidden', users.length > 0);
	document.getElementById('userTableBody').innerHTML = users.map(user => { const count = requests.filter((request) => request.userId === user.id).length; return `<tr><td><strong>${user.name}</strong></td><td>${user.email || '-'}</td><td>${statusMarkup('completed')}</td><td>${formatMoney(user.fiatBalance, user.fiatCurrency)}</td><td>${user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '-'}</td><td>${count}</td></tr>`; }).join('');
	document.getElementById('userCards').innerHTML = users.map(user => `<article class="request-card"><div class="request-card-top"><strong>${user.name}</strong>${statusMarkup('completed')}</div><div class="request-card-grid"><span>Email<strong>${user.email || '-'}</strong></span><span>Balance<strong>${formatMoney(user.fiatBalance, user.fiatCurrency)}</strong></span><span>Transactions<strong>${requests.filter((request) => request.userId === user.id).length}</strong></span></div></article>`).join('');
}

function showToast(message, type = 'info') {
	const toast = document.getElementById('adminToast');
	toast.textContent = message;
	toast.className = `admin-toast toast-${type}`;
	setTimeout(() => toast.classList.remove('toast-visible'), 3200);
	requestAnimationFrame(() => toast.classList.add('toast-visible'));
}

function openRequest(requestId) {
	const request = getRequests().find((entry) => entry.id === requestId);
	if (!request) return;
	const dialog = document.getElementById('requestDialog');
	const details = document.getElementById('requestDetails');
	details.innerHTML = `<p class="admin-kicker">Request details</p><h2>${request.id}</h2><div class="detail-list"><div><span>Customer</span><strong>${request.userName}</strong></div><div><span>User ID</span><strong>${request.userId}</strong></div><div><span>Crypto</span><strong>${request.asset} · ${request.network}</strong></div><div><span>Requested amount</span><strong>${request.cryptoAmount} ${request.asset}</strong></div><div><span>Exchange rate</span><strong>${formatMoney(request.exchangeRate || 0, request.fiatCurrency)} / ${request.asset}</strong></div><div><span>Crypto value</span><strong>${formatMoney(getRequestBase(request), request.fiatCurrency)}</strong></div><div><span>Service fee</span><strong>${formatMoney(getRequestFee(request), request.fiatCurrency)}</strong></div><div><span>Total to deduct</span><strong>${formatMoney(getRequestTotal(request), request.fiatCurrency)}</strong></div><div><span>Requested</span><strong>${new Date(request.createdAt).toLocaleString()}</strong></div><div class="detail-wallet"><span>External wallet address</span><strong>${request.walletAddress}</strong><button class="copy-address" data-address="${request.walletAddress}" type="button">Copy</button></div><div><span>Status</span><strong>${statusMarkup(request.status)}</strong></div></div>${request.status === 'pending' ? '<div class="dialog-actions"><button class="btn btn-secondary" data-reject type="button">Reject Request</button><button class="btn btn-primary" data-approve type="button">Approve Request</button></div>' : '<p class="review-note">This request has already been processed.</p>'}`;
	dialog.dataset.requestId = request.id;
	dialog.showModal();
}

function closeRequestDialog() {
	const dialog = document.getElementById('requestDialog');
	if (dialog?.open) dialog.close();
}

function processRequest(requestId, nextStatus) {
	const requests = getRequests();
	const request = requests.find((entry) => entry.id === requestId);
	if (!request || request.status !== 'pending') return;
	if (nextStatus === 'completed') {
		const users = readState(USERS_KEY);
		const user = users.find((entry) => entry.id === request.userId);
		if (!user || Number(user.fiatBalance) < getRequestTotal(request)) {
			showToast('Insufficient balance to complete this request.', 'error');
			return;
		}
		user.fiatBalance -= getRequestTotal(request);
		writeState(USERS_KEY, users);
		request.status = 'completed';
		request.completedAt = new Date().toISOString();
		const transactions = readState(TRANSACTIONS_KEY);
		writeState(TRANSACTIONS_KEY, [{ id: request.id, userId: request.userId, type: 'crypto_purchase', description: `Purchased ${request.cryptoAmount} ${request.asset}`, fiatAmount: -getRequestTotal(request), baseAmount: getRequestBase(request), serviceFee: getRequestFee(request), fiatCurrency: request.fiatCurrency, status: 'completed', createdAt: request.completedAt, reference: request.id }, ...transactions]);
		const notifications = readState(NOTIFICATIONS_KEY);
		writeState(NOTIFICATIONS_KEY, [{ id: `NT-${Date.now()}`, userId: request.userId, title: 'Crypto Purchase Completed', message: `Your ${request.cryptoAmount} ${request.asset} purchase has been completed. Your crypto has been sent to your external wallet. Please check your external wallet to confirm receipt.`, createdAt: request.completedAt, read: false }, ...notifications]);
		showToast('Request approved and fiat balance deducted.', 'success');
	} else {
		const reason = window.prompt('Reason for rejecting this request:', 'Your request could not be processed at this time.');
		request.status = 'rejected';
		request.rejectionReason = reason || 'Your request could not be processed at this time.';
		request.rejectedAt = new Date().toISOString();
		const notifications = readState(NOTIFICATIONS_KEY);
		writeState(NOTIFICATIONS_KEY, [{ id: `NT-${Date.now()}`, userId: request.userId, title: 'Crypto Request Rejected', message: request.rejectionReason, createdAt: request.rejectedAt, read: false }, ...notifications]);
		showToast('Request rejected.', 'info');
	}
	writeState(REQUESTS_KEY, requests);
	const activity = readState(ACTIVITY_KEY);
	activity.unshift({ id: `ACT-${Date.now()}`, message: nextStatus === 'completed' ? `Crypto request ${request.id} approved. ${formatMoney(getRequestTotal(request), request.fiatCurrency)} deducted from ${request.userName}'s balance.` : `Crypto request ${request.id} rejected.`, createdAt: new Date().toISOString() });
	writeState(ACTIVITY_KEY, activity);
	closeRequestDialog();
	renderAll();
}

function renderAll() { renderAdminIdentity(); renderOverview(); renderRequests(); renderFeeds(); renderTransactions(); renderUsers(); }

document.addEventListener('DOMContentLoaded', () => {
	if (!guardAdminDashboard()) return;
	renderAll();
	document.getElementById('statusFilter').addEventListener('change', renderRequests);
	document.getElementById('userSearch').addEventListener('input', renderUsers);
	document.getElementById('userStatus').addEventListener('change', renderUsers);
	document.getElementById('transactionSearch').addEventListener('input', renderTransactions);
	document.getElementById('transactionStatus').addEventListener('change', renderTransactions);
	document.addEventListener('click', (event) => {
		const reviewButton = event.target.closest('[data-request-id]');
		if (reviewButton) openRequest(reviewButton.dataset.requestId);
		if (event.target.closest('[data-approve]')) processRequest(document.getElementById('requestDialog').dataset.requestId, 'completed');
		if (event.target.closest('[data-reject]')) processRequest(document.getElementById('requestDialog').dataset.requestId, 'rejected');
		const copyButton = event.target.closest('.copy-address');
		if (copyButton) navigator.clipboard?.writeText(copyButton.dataset.address).then(() => showToast('Wallet address copied.', 'success'));
	});
	document.getElementById('dialogClose').addEventListener('click', closeRequestDialog);
	document.getElementById('requestDialog').addEventListener('cancel', (event) => {
		event.preventDefault();
		closeRequestDialog();
	});
	document.getElementById('requestDialog').addEventListener('click', (event) => {
		if (event.target === event.currentTarget) closeRequestDialog();
	});
	document.getElementById('adminMenuButton').addEventListener('click', () => { document.getElementById('adminSidebar').classList.add('open'); document.getElementById('adminBackdrop').classList.remove('hidden'); });
	document.getElementById('adminBackdrop').addEventListener('click', () => { document.getElementById('adminSidebar').classList.remove('open'); document.getElementById('adminBackdrop').classList.add('hidden'); });
	document.getElementById('adminLogout').addEventListener('click', () => { clearAdminSession(); goToAdminLogin(); });
});
