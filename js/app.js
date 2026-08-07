/*
Project: Trans Wallet Project
File Purpose: Shared app initialization and bootstrap
Author Placeholder: Frontend Engineer
Created Date Placeholder: 2026-08-03
Last Updated Placeholder: 2026-08-07
Description: Central entry point for common page initialization and layout management.
*/

// ===== MODULE OWNER =====
// This file is intended for:
// Frontend Engineer
// Responsibilities:
// - Initialize shared UI logic
// - Set up navigation hooks and inject layout elements dynamically
// - Maintain app-level helpers and simulation frameworks
// ================================================

/* ========================================================
   GLOBAL DEVELOPER & AI GUIDANCE COMMENTS
   ========================================================
   SHARED NAVIGATION:
   Navigation is dynamically injected across all views when the body is 
   assigned the 'app-logged-in' class. Do not manually copy navigation markup
   into feature pages.

   AI DEVELOPMENT NOTICE:
   AI tools must NOT rewrite the app structure, modify variables.css variables,
   or reorganize any files in this project. Only localized, page-specific changes
   within assigned tasks are permitted.
   ======================================================== */

/**
 * Dynamically builds and injects the Desktop Sidebar, Mobile Top Header, Mobile Bottom Navigation
 * and Backdrop Overlay for all logged-in views. Identifies the active page to highlight navigation links.
 */
function injectNavigation() {
  if (!document.body.classList.contains('app-logged-in')) {
    return;
  }

  // Create Top Header (Mobile & Tablet Layout)
  const mobileHeader = document.createElement('header');
  mobileHeader.className = 'app-mobile-header';
  mobileHeader.innerHTML = `
    <div class="brand-logo">
      <img src="../images/transwallet-logo-removebg-preview.png" alt="Trans Wallet Logo" class="logo-img" />
      <span class="logo-text"><span class="logo-text-primary">Trans</span><span class="logo-text-secondary">Wallet</span></span>
    </div>
    <button class="mobile-menu-trigger" id="mobile-menu-trigger" aria-label="Open menu">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  `;

  // Create Sidebar (Desktop permanent, Mobile/Tablet drawer overlay)
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-logo-container">
      <div class="brand-logo">
        <img src="../images/transwallet-logo-removebg-preview.png" alt="Trans Wallet Logo" class="logo-img" />
        <span class="logo-text"><span class="logo-text-primary">Trans</span><span class="logo-text-secondary">Wallet</span></span>
      </div>
      <button class="sidebar-close-btn" id="sidebar-close-btn" aria-label="Close menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <nav class="sidebar-nav">
      <a href="dashboard.html" class="nav-item" id="nav-dashboard">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span>Dashboard</span>
      </a>
      <a href="send-money.html" class="nav-item" id="nav-send">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        <span>Send Money</span>
      </a>
      <a href="receive-money.html" class="nav-item" id="nav-receive">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M12 2v9m-4-4l4 4 4-4"></path></svg>
        <span>Receive Money</span>
      </a>
      <a href="exchange-rate.html" class="nav-item" id="nav-exchange">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 3 21 8 16 13"></polyline><line x1="21" y1="8" x2="9" y2="8"></line><polyline points="8 21 3 16 8 11"></polyline><line x1="3" y1="16" x2="15" y2="16"></line></svg>
        <span>Exchange Rate</span>
      </a>
      <a href="transactions.html" class="nav-item" id="nav-transactions">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Transactions</span>
      </a>
      <a href="crypto-request.html" class="nav-item" id="nav-crypto">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <span>Crypto Request</span>
      </a>
      <a href="cards.html" class="nav-item" id="nav-cards">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        <span>Cards</span>
      </a>
      <a href="help.html" class="nav-item" id="nav-help">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span>Help Center</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <a href="landing.html" class="nav-item logout-link" id="nav-logout">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        <span>Logout</span>
      </a>
    </div>
  `;

  // Create Bottom Nav (Mobile Layout)
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'app-bottom-nav';
  bottomNav.innerHTML = `
    <a href="dashboard.html" class="bottom-nav-item" id="m-nav-dashboard">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      <span>Home</span>
    </a>
    <a href="cards.html" class="bottom-nav-item" id="m-nav-cards">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
      <span>Cards</span>
    </a>
    <a href="crypto-request.html" class="bottom-nav-item" id="m-nav-crypto">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
      <span>Crypto</span>
    </a>
    <a href="exchange-rate.html" class="bottom-nav-item" id="m-nav-exchange">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 3 21 8 16 13"></polyline><line x1="21" y1="8" x2="9" y2="8"></line><polyline points="8 21 3 16 8 11"></polyline><line x1="3" y1="16" x2="15" y2="16"></line></svg>
      <span>Rate</span>
    </a>
    <a href="transactions.html" class="bottom-nav-item" id="m-nav-transactions">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      <span>History</span>
    </a>
  `;

  // Create Backdrop Overlay
  const backdrop = document.createElement('div');
  backdrop.className = 'app-backdrop';
  backdrop.id = 'app-backdrop';

  // Inject elements into DOM structure
  document.body.insertBefore(mobileHeader, document.body.firstChild);
  document.body.insertBefore(sidebar, document.body.firstChild);
  document.body.appendChild(bottomNav);
  document.body.appendChild(backdrop);

  // Setup active states based on current filename
  const path = window.location.pathname;
  const page = path.split('/').pop().toLowerCase() || 'dashboard.html';

  function setActive() {
    const desktopIdMap = {
      'dashboard.html': 'nav-dashboard',
      'send-money.html': 'nav-send',
      'receive-money.html': 'nav-receive',
      'exchange-rate.html': 'nav-exchange',
      'transactions.html': 'nav-transactions',
      'crypto-request.html': 'nav-crypto',
      'cards.html': 'nav-cards',
      'help.html': 'nav-help'
    };

    const mobileIdMap = {
      'dashboard.html': 'm-nav-dashboard',
      'cards.html': 'm-nav-cards',
      'crypto-request.html': 'm-nav-crypto',
      'exchange-rate.html': 'm-nav-exchange',
      'transactions.html': 'm-nav-transactions'
    };

    // Desktop highlighting
    let matchedPage = 'dashboard.html';
    for (const key in desktopIdMap) {
      if (page.includes(key)) {
        matchedPage = key;
        break;
      }
    }
    const desktopEl = document.getElementById(desktopIdMap[matchedPage]);
    if (desktopEl) {
      desktopEl.classList.add('active');
    }

    // Mobile highlighting
    let matchedMobilePage = '';
    for (const key in mobileIdMap) {
      if (page.includes(key)) {
        matchedMobilePage = key;
        break;
      }
    }
    if (matchedMobilePage) {
      const mobileEl = document.getElementById(mobileIdMap[matchedMobilePage]);
      if (mobileEl) {
        mobileEl.classList.add('active');
      }
    }
  }

  setActive();

  // Bind Drawer Open/Close Events
  function openDrawer() {
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    document.body.classList.remove('drawer-open');
  }

  // Hamburger trigger click
  const menuTrigger = document.getElementById('mobile-menu-trigger');
  if (menuTrigger) {
    menuTrigger.addEventListener('click', openDrawer);
  }

  // Close button click
  const closeBtn = document.getElementById('sidebar-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Backdrop click
  const appBackdrop = document.getElementById('app-backdrop');
  if (appBackdrop) {
    appBackdrop.addEventListener('click', closeDrawer);
  }

  // Escape key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Navigation item clicks (closes drawer while navigating)
  const navItems = document.querySelectorAll('.app-sidebar .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Bind logout simulation trigger
  const logoutLinks = document.querySelectorAll('.logout-link');
  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      // Clear session simulation details
      localStorage.removeItem('user_session');
      localStorage.removeItem('current_user');
      console.info('Simulated logout: Session cleared.');
      // Redirect back to Landing Experience
      window.location.href = 'landing.html';
    });
  });
}

function initApp() {
  console.info('Trans Wallet app initialized');
  // Inject the shared visual layouts
  injectNavigation();
}

document.addEventListener('DOMContentLoaded', initApp);
