/*
Project: Trans Wallet Project
File Purpose: Crypto purchase request flow
Author Placeholder: Crypto Developer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-11
Description: Interactive crypto-detail page behavior for request creation and activity rendering.
*/

// ===== MODULE OWNER =====
// This file is intended for:
// Crypto Developer
// Responsibilities:
// Build crypto request form
// Simulate purchase request state
// Present pending request review
// Maintain page-specific network selection and quote rendering
// ================================================

const cryptoAssets = {
  usdt: {
    id: 'usdt',
    name: 'USDT',
    displayName: 'Tether USD',
    description: 'Request the stablecoin securely through the selected network.',
    defaultNetwork: 'BEP20',
    networks: ['BEP20', 'ERC20', 'TRC20'],
    price: 1.0,
    fiatRate: '₦1,415.95 ',
    fee: '0.15 USDT',
    minAmount: 2,
    balance: 4284.7,
    tokenAvatar: 'T',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'tether',
    icon: 'USDT_Logo.png',
    priceChange: 0.0,
    priceDirection: 'neutral'
  },
  eth: {
    id: 'eth',
    name: 'ETH',
    displayName: 'Ethereum',
    description: 'Buy Ethereum quickly with network fee previews and review flow.',
    defaultNetwork: 'ERC20',
    networks: ['ERC20', 'BEP20', 'Polygon'],
    price: 1886.26,
    fiatRate: '₦1,415.95',
    fee: '0.012 ETH',
    minAmount: 0.01,
    balance: 4.72,
    tokenAvatar: 'E',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'ethereum',
    icon: 'ethereum-eth-logo.png',
    priceChange: 1.07,
    priceDirection: 'positive'
  },
  btc: {
    id: 'btc',
    name: 'BTC',
    displayName: 'Bitcoin',
    description: 'Request Bitcoin on the protocol of your choice and confirm before sending.',
    defaultNetwork: 'Bitcoin',
    networks: ['Bitcoin', 'Lightning'],
    price: 64271.15,
    fiatRate: '₦1,415.95',
    fee: '0.0004 BTC',
    minAmount: 0.001,
    balance: 0.285,
    tokenAvatar: 'B',
    networkFeeLabel: 'Miner Fee',
    coingeckoSlug: 'bitcoin',
    priceChange: 0.92,
    priceDirection: 'negative',
    icon: 'bitcoin-btc-logo.png'
  },
  sol: {
    id: 'sol',
    name: 'SOL',
    displayName: 'Solana',
    description: 'Fast, low-cost transfers for modern crypto flows.',
    defaultNetwork: 'Solana',
    networks: ['Solana'],
    price: 75.8,
    fiatRate: '₦1,415.95',
    fee: '0.001 SOL',
    minAmount: 0.1,
    balance: 118.4,
    tokenAvatar: 'S',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'solana',
    priceChange: 1.05,
    priceDirection: 'negative',
    icon: 'Solana_logo.png'
  },
  bnb: {
    id: 'bnb',
    name: 'BNB',
    displayName: 'BNB Smart Chain',
    description: 'Request BNB smoothly across smart contract networks.',
    defaultNetwork: 'BEP20',
    networks: ['BEP20', 'BNB Chain'],
    price: 612.43,
    fiatRate: '₦1,415.95',
    fee: '0.005 BNB',
    minAmount: 0.02,
    balance: 23.6,
    tokenAvatar: 'B',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'binancecoin',
    priceChange: 1.56,
    priceDirection: 'positive',
    icon: 'bnb-bnb-logo.png'
  },
  ton: {
    id: 'ton',
    name: 'TON',
    displayName: 'Gram (TON)',
    description: 'Request TON with low fees and fast settlement.',
    defaultNetwork: 'TON',
    networks: ['TON'],
    price: 1.35,
    fiatRate: '₦1,415.95',
    fee: '0.02 TON',
    minAmount: 2,
    balance: 530.8,
    tokenAvatar: 'T',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'the-open-network',
    priceChange: 1.28,
    priceDirection: 'positive',
    icon: 'gram ton.png'
  },
  usdc: {
    id: 'usdc',
    name: 'USDC',
    displayName: 'USDC Coin',
    description: 'Request the dollar-backed stablecoin with a reliable network choice.',
    defaultNetwork: 'ERC20',
    networks: ['ERC20', 'BEP20'],
    price: 1.0,
    fiatRate: '₦1,415.95',
    fee: '0.12 USDC',
    minAmount: 2,
    balance: 1250.0,
    tokenAvatar: 'U',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'usd-coin',
    priceChange: 0.0,
    priceDirection: 'neutral',
    icon: 'usdc.png'
  },
  core: {
    id: 'core',
    name: 'CORE',
    displayName: 'Core',
    description: 'Request CORE with modern network transparency.',
    defaultNetwork: 'CORE',
    networks: ['CORE'],
    price: 0.02,
    fiatRate: '₦1,415.95',
    fee: '0.001 CORE',
    minAmount: 50,
    balance: 13000,
    tokenAvatar: 'C',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'core',
    priceChange: 1.22,
    priceDirection: 'negative',
    icon: 'core-dao-core-logo.png'
  },
  sui: {
    id: 'sui',
    name: 'SUI',
    displayName: 'Sui',
    description: 'Request SUI with a clean, modern crypto experience.',
    defaultNetwork: 'SUI',
    networks: ['SUI'],
    price: 0.69,
    fiatRate: '₦1,415.95',
    fee: '0.005 SUI',
    minAmount: 4,
    balance: 860.2,
    tokenAvatar: 'S',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'sui',
    priceChange: 0.77,
    priceDirection: 'negative',
    icon: 'Sui_logo.png'
  },
  base: {
    id: 'base',
    name: 'BASE',
    displayName: 'Base ETH',
    description: 'Request Base transactions with low fees and fast settlement.',
    defaultNetwork: 'BASE_ETH',
    networks: ['BASE_ETH'],
    price: 1.0,
    fiatRate: '₦1,415.95',
    fee: '0.02 BASE',
    minAmount: 2,
    balance: 594.1,
    tokenAvatar: 'B',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'base',
    priceChange: 1.07,
    priceDirection: 'positive',
    icon: 'base logo.png'
  },
  ltc: {
    id: 'ltc',
    name: 'LTC',
    displayName: 'Litecoin',
    description: 'Request Litecoin when you need a simple, trusted coin.',
    defaultNetwork: 'LTC',
    networks: ['LTC'],
    price: 45.31,
    fiatRate: '₦1,415.95',
    fee: '0.003 LTC',
    minAmount: 0.05,
    balance: 18.6,
    tokenAvatar: 'L',
    networkFeeLabel: 'Network Fee',
    coingeckoSlug: 'litecoin',
    priceChange: 0.19,
    priceDirection: 'negative',
    icon: 'Litecoin_Logo.jpg'
  }
};

let currentAsset = cryptoAssets.usdt;
let currentNetwork = currentAsset.defaultNetwork;
const activityHistory = [];
const CRYPTO_REQUESTS_KEY = 'transwallet_crypto_requests';
const USERS_KEY = 'transwallet_users';
const NOTIFICATIONS_KEY = 'transwallet_notifications';
const TRANSACTIONS_KEY = 'transwallet_transactions';
const ADMIN_ACTIVITY_KEY = 'transwallet_admin_activity';
const DEFAULT_FIAT_BALANCE = 1000000;
const CRYPTO_EXCHANGE_RATE = 1415.95;
const CRYPTO_SERVICE_FEE_RATE = 0.01;
let pendingReview = null;

function readFeatureState(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

function writeFeatureState(key, value) {
  const serialized = JSON.stringify(value);
  sessionStorage.setItem(key, serialized);
  localStorage.setItem(key, serialized);
}

function getCurrentUser() {
  try {
    const storedUser = JSON.parse(localStorage.getItem('current_user') || 'null');
    return storedUser || { id: 'USR-0001', name: 'Alex Morgan', email: 'alex@example.com' };
  } catch (error) {
    return { id: 'USR-0001', name: 'Alex Morgan', email: 'alex@example.com' };
  }
}

function getUserAccount(user) {
  const users = readLocalState(USERS_KEY, []);
  let account = users.find((entry) => entry.id === user.id);
  if (!account) {
    account = { id: user.id, name: user.name, email: user.email, status: 'active', joinedAt: new Date().toISOString(), fiatCurrency: 'NGN', fiatBalance: DEFAULT_FIAT_BALANCE };
    writeLocalState(USERS_KEY, [...users, account]);
  }
  return account;
}

function readLocalState(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

function writeLocalState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function recordAdminActivity(message) {
  const activity = readLocalState(ADMIN_ACTIVITY_KEY, []);
  writeLocalState(ADMIN_ACTIVITY_KEY, [{ id: `ACT-${Date.now()}`, message, createdAt: new Date().toISOString() }, ...activity]);
}

function maskAddress(address) {
  return address.length > 12 ? `${address.slice(0, 6)}••••${address.slice(-6)}` : address;
}

function calculateCryptoQuote(amount, asset) {
  const baseAmount = Math.round(amount * asset.price * CRYPTO_EXCHANGE_RATE);
  const serviceFee = Math.round(baseAmount * CRYPTO_SERVICE_FEE_RATE);
  return { baseAmount, serviceFee, totalAmount: baseAmount + serviceFee };
}

function formatNaira(amount) {
  return `NGN ${Number(amount || 0).toLocaleString()}`;
}

function getQueryCoin() {
  const params = new URLSearchParams(window.location.search);
  const coin = params.get('coin')?.toLowerCase();
  return cryptoAssets[coin] ? coin : null;
}

function formatCurrency(value) {
  return typeof value === 'number' ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value;
}

function setAlert(message, type = 'error') {
  const alertEl = document.getElementById('formAlert');
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = `form-alert form-alert-${type}`;
  if (message) {
    alertEl.setAttribute('role', 'status');
  } else {
    alertEl.removeAttribute('role');
  }
}

function renderAsset(asset) {
  currentAsset = asset;
  currentNetwork = asset.defaultNetwork;

  document.getElementById('cryptoTitle').textContent = asset.name;
  document.getElementById('cryptoSubtitle').textContent = asset.description;
  document.getElementById('cryptoAvatar').innerHTML = asset.icon
    ? `<img class="token-image" src="../images/${asset.icon}" alt="${asset.name} logo" />`
    : asset.tokenAvatar;
  document.getElementById('cryptoSymbol').textContent = asset.name;
  document.getElementById('cryptoNetwork').textContent = currentNetwork;
  document.getElementById('priceLabel').textContent = `${asset.name} PRICE`;
  document.getElementById('priceValue').textContent = formatCurrency(asset.price);
  document.getElementById('fiatValue').textContent = asset.fiatRate;
  document.getElementById('networkName').textContent = currentNetwork;
  document.getElementById('networkFee').textContent = `${asset.networkFeeLabel}: ${asset.fee}`;
  document.getElementById('networkAvatar').textContent = asset.tokenAvatar;
  document.getElementById('assetSelect').textContent = asset.name;
  document.getElementById('fieldNote').textContent = `Min ${asset.minAmount} ${asset.name}`;
  const account = getUserAccount(getCurrentUser());
  document.getElementById('balanceNote').innerHTML = `Fiat balance: <strong>${account.fiatCurrency} ${account.fiatBalance.toLocaleString()}</strong>`;

  renderNetworkPicker(asset.networks, currentNetwork);
  setAlert('');
}

function renderNetworkPicker(networks, activeNetwork) {
  const picker = document.getElementById('networkPicker');
  if (!picker) return;
  picker.innerHTML = networks
    .map((network) => {
      const selectedClass = network === activeNetwork ? 'network-option-selected' : '';
      return `<button type="button" class="network-option ${selectedClass}" data-network="${network}">${network}</button>`;
    })
    .join('');
}

function renderAssetPicker(assetKey) {
  const picker = document.getElementById('assetPicker');
  if (!picker) return;
  picker.innerHTML = Object.values(cryptoAssets)
    .map((asset) => {
      const activeClass = asset.id === assetKey ? 'asset-option-selected' : '';
      return `<button type="button" class="asset-option ${activeClass}" data-asset="${asset.id}">${asset.name} · ${asset.displayName}</button>`;
    })
    .join('');
}

function renderCoinList() {
  const listGrid = document.getElementById('cryptoListGrid');
  if (!listGrid) return;

  const listMarkup = Object.values(cryptoAssets)
    .map((asset) => {
      const directionClass = asset.priceDirection === 'positive' ? 'positive' : asset.priceDirection === 'negative' ? 'negative' : '';
      const directionSymbol = asset.priceDirection === 'positive' ? '↑' : asset.priceDirection === 'negative' ? '↓' : '';
      const priceChange = typeof asset.priceChange === 'number' ? `${directionSymbol}${asset.priceChange}%` : '';
      const avatarMarkup = asset.icon
        ? `<img class="crypto-list-avatar-image" src="../images/${asset.icon}" alt="${asset.name} logo" />`
        : asset.tokenAvatar;
      return `
        <a class="crypto-list-item" href="?coin=${asset.id}" aria-label="Open ${asset.name} request page">
          <div class="crypto-list-row">
            <span class="crypto-list-avatar">${avatarMarkup}</span>
            <div class="crypto-list-meta">
              <strong>${asset.name}</strong>
              <span>${asset.displayName}</span>
            </div>
          </div>
          <div class="crypto-list-stats">
            <strong>${formatCurrency(asset.price)}</strong>
            <span class="price-change ${directionClass}">${directionSymbol}${asset.priceChange}%</span>
          </div>
        </a>
      `;
    })
    .join('');

  listGrid.innerHTML = listMarkup;
}

function showView(view) {
  const listPage = document.getElementById('cryptoListPage');
  const detailView = document.getElementById('cryptoDetailView');
  if (!listPage || !detailView) return;

  if (view === 'detail') {
    listPage.classList.add('hidden');
    detailView.classList.remove('hidden');
  } else {
    detailView.classList.add('hidden');
    listPage.classList.remove('hidden');
  }
}

function renderActivity() {
  const card = document.getElementById('cryptoActivityCard');
  if (!card) return;

  const historyContainer = document.createElement('div');
  historyContainer.className = 'activity-list';

  const requests = readFeatureState(CRYPTO_REQUESTS_KEY).filter((request) => request.userId === getCurrentUser().id);
  if (!requests.length) {
    card.innerHTML = `
      <div class="activity-empty" id="cryptoActivityEmpty">
        <span class="activity-icon">⟳</span>
        <p>No transaction records</p>
      </div>
    `;
    return;
  }

  historyContainer.innerHTML = requests
    .map((entry) => `
      <article class="activity-item">
        <div class="activity-meta">
          <strong>${entry.cryptoAmount} ${entry.asset}</strong>
          <span>${entry.status.toUpperCase()}</span>
        </div>
        <p class="activity-details">${entry.status === 'completed' ? `Crypto sent to external wallet ${maskAddress(entry.walletAddress)}. Please check your external wallet.` : entry.status === 'rejected' ? entry.rejectionReason : `To external wallet ${maskAddress(entry.walletAddress)}`}</p>
        <p class="activity-time">${new Date(entry.createdAt).toLocaleString()}</p>
      </article>
    `)
    .join('');

  card.innerHTML = '';
  card.appendChild(historyContainer);
}

function toggleNetworkPicker() {
  const picker = document.getElementById('networkPicker');
  if (!picker) return;
  picker.classList.toggle('hidden');
}

function closeNetworkPicker() {
  const picker = document.getElementById('networkPicker');
  if (!picker) return;
  picker.classList.add('hidden');
}

function toggleAssetPicker() {
  const picker = document.getElementById('assetPicker');
  if (!picker) return;
  picker.classList.toggle('hidden');
}

function closeAssetPicker() {
  const picker = document.getElementById('assetPicker');
  if (!picker) return;
  picker.classList.add('hidden');
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const addressInput = document.getElementById('walletAddress');
  const amountInput = document.getElementById('requestAmount');
  const address = addressInput.value.trim();
  const amount = Number(amountInput.value);

  if (!address) {
    setAlert('Please enter a valid wallet address.');
    addressInput.focus();
    return;
  }

  if (!amount || amount < currentAsset.minAmount) {
    setAlert(`Amount must be at least ${currentAsset.minAmount} ${currentAsset.name}.`);
    amountInput.focus();
    return;
  }

  const account = getUserAccount(getCurrentUser());
  const quote = calculateCryptoQuote(amount, currentAsset);
  pendingReview = {
    id: `CR-${Date.now().toString().slice(-6)}`,
    userId: account.id,
    userName: account.name,
    asset: currentAsset.name,
    cryptoAmount: amount,
    fiatCurrency: account.fiatCurrency,
    exchangeRate: CRYPTO_EXCHANGE_RATE,
    baseAmount: quote.baseAmount,
    serviceFee: quote.serviceFee,
    totalAmount: quote.totalAmount,
    fiatAmount: quote.totalAmount,
    walletAddress: address,
    network: currentNetwork,
    status: 'pending',
    type: 'crypto_purchase',
    createdAt: new Date().toISOString()
  };
  document.getElementById('reviewAsset').textContent = pendingReview.asset;
  document.getElementById('reviewAmount').textContent = `${pendingReview.cryptoAmount} ${pendingReview.asset}`;
  document.getElementById('reviewRate').textContent = `${formatNaira(pendingReview.exchangeRate)} / ${pendingReview.asset}`;
  document.getElementById('reviewBaseAmount').textContent = formatNaira(pendingReview.baseAmount);
  document.getElementById('reviewServiceFee').textContent = formatNaira(pendingReview.serviceFee);
  document.getElementById('reviewWallet').textContent = maskAddress(pendingReview.walletAddress);
  document.getElementById('reviewTotal').textContent = formatNaira(pendingReview.totalAmount);
  form.classList.add('hidden');
  document.getElementById('cryptoReview').classList.remove('hidden');
  setAlert('');
}

function submitReviewedRequest() {
  if (!pendingReview) return;
  const requests = readFeatureState(CRYPTO_REQUESTS_KEY);
  writeFeatureState(CRYPTO_REQUESTS_KEY, [pendingReview, ...requests]);
  recordAdminActivity(`New crypto request ${pendingReview.id} received from ${pendingReview.userName}.`);
  setAlert(`Request ${pendingReview.id} submitted and is awaiting confirmation.`, 'success');
  pendingReview = null;
  document.getElementById('cryptoReview').classList.add('hidden');
  document.getElementById('cryptoRequestForm').classList.remove('hidden');
  document.getElementById('requestAmount').value = '';
  document.getElementById('walletAddress').value = '';
  renderActivity();
}

function bindEvents() {
  const form = document.getElementById('cryptoRequestForm');
  const pasteBtn = document.getElementById('pasteBtn');
  const maxBtn = document.getElementById('maxBtn');
  const marketBtn = document.getElementById('marketRatesBtn');
  const networkChangeBtn = document.getElementById('networkChangeBtn');
  const picker = document.getElementById('networkPicker');
  const review = document.getElementById('cryptoReview');

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  document.getElementById('confirmRequestBtn')?.addEventListener('click', submitReviewedRequest);
  document.getElementById('editRequestBtn')?.addEventListener('click', () => {
    review?.classList.add('hidden');
    form?.classList.remove('hidden');
  });

  if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          document.getElementById('walletAddress').value = text.trim();
          setAlert('Pasted wallet address from clipboard.', 'success');
        } else {
          setAlert('Clipboard is empty or inaccessible.');
        }
      } catch (error) {
        setAlert('Unable to access clipboard. Please paste manually.');
      }
    });
  }

  if (maxBtn) {
    maxBtn.addEventListener('click', () => {
      document.getElementById('requestAmount').value = currentAsset.balance.toFixed(4);
      setAlert('Max available balance applied.', 'success');
    });
  }

  if (marketBtn) {
    marketBtn.addEventListener('click', () => {
      const url = `https://www.coingecko.com/en/coins/${currentAsset.coingeckoSlug}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  const assetPicker = document.getElementById('assetPicker');
  const assetSelect = document.getElementById('assetSelect');

  if (networkChangeBtn) {
    networkChangeBtn.addEventListener('click', () => {
      closeAssetPicker();
      toggleNetworkPicker();
    });
  }

  if (assetSelect) {
    assetSelect.addEventListener('click', () => {
      closeNetworkPicker();
      toggleAssetPicker();
    });
  }

  if (picker) {
    picker.addEventListener('click', (event) => {
      const button = event.target.closest('.network-option');
      if (!button) return;
      const selectedNetwork = button.dataset.network;
      if (!selectedNetwork) return;
      currentNetwork = selectedNetwork;
      document.getElementById('cryptoNetwork').textContent = currentNetwork;
      document.getElementById('networkName').textContent = currentNetwork;
      setAlert(`Network changed to ${currentNetwork}.`, 'success');
      closeNetworkPicker();
      renderNetworkPicker(currentAsset.networks, currentNetwork);
    });
  }

  if (assetPicker) {
    assetPicker.addEventListener('click', (event) => {
      const button = event.target.closest('.asset-option');
      if (!button) return;
      const selectedAsset = button.dataset.asset;
      if (!selectedAsset || !cryptoAssets[selectedAsset]) return;
      renderAsset(cryptoAssets[selectedAsset]);
      document.getElementById('assetSelect').textContent = cryptoAssets[selectedAsset].name;
      setAlert(`Selected ${cryptoAssets[selectedAsset].name}.`, 'success');
      closeAssetPicker();
      renderAssetPicker(selectedAsset);
    });
  }

  document.addEventListener('click', (event) => {
    const networkPickerContainer = document.getElementById('networkPicker');
    const assetPickerContainer = document.getElementById('assetPicker');
    const clickedInsideNetworkPicker = networkPickerContainer?.contains(event.target);
    const clickedInsideAssetPicker = assetPickerContainer?.contains(event.target);
    const clickedNetworkButton = event.target.closest('#networkChangeBtn');
    const clickedAssetButton = event.target.closest('#assetSelect');

    if (!clickedInsideNetworkPicker && !clickedNetworkButton) {
      closeNetworkPicker();
    }

    if (!clickedInsideAssetPicker && !clickedAssetButton) {
      closeAssetPicker();
    }
  });
}

function initCryptoFlow() {
  const assetKey = getQueryCoin();
  renderCoinList();
  renderAssetPicker(assetKey || 'usdt');

  if (assetKey) {
    renderAsset(cryptoAssets[assetKey]);
    showView('detail');
  } else {
    showView('list');
  }

  bindEvents();
  renderActivity();
  console.info('Crypto module ready', assetKey ? `detail view for ${assetKey}` : 'all coins list');
}

document.addEventListener('DOMContentLoaded', initCryptoFlow);
