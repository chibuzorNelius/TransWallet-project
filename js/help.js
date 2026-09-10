const SUPPORT_MESSAGES_KEY = 'transwallet_support_messages';
const ADMIN_NOTIFICATIONS_KEY = 'transwallet_notifications';

function readJson(key, fallback = []) {
    try {
        const storedValue = localStorage.getItem(key) || sessionStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : fallback;
    } catch (error) {
        return fallback;
    }
}

function writeJson(key, value) {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    sessionStorage.setItem(key, serialized);
}

function getCurrentUser() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        if (currentUser) {
            return currentUser;
        }
    } catch (error) {
        // Ignore malformed storage.
    }

    try {
        const session = JSON.parse(localStorage.getItem('transwallet_user_session') || 'null');
        const users = JSON.parse(localStorage.getItem('transwallet_users') || '[]');
        if (session && session.userId) {
            return users.find((user) => user.id === session.userId) || null;
        }
    } catch (error) {
        // Ignore malformed storage.
    }

    return null;
}

function showHelpFeedback(message, type = 'success') {
    const toast = document.getElementById('helpToast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `help-toast help-toast-${type} visible`;
    window.clearTimeout(showHelpFeedback.timeoutId);
    showHelpFeedback.timeoutId = window.setTimeout(() => {
        toast.classList.remove('visible');
    }, 3200);
}

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            const parentItem = question.closest('.faq-item');
            const answer = question.nextElementSibling;
            const isOpen = parentItem.classList.contains('active');

            faqItems.forEach(function (item) {
                const itemButton = item.querySelector('.faq-question');
                const itemAnswer = item.querySelector('.faq-answer');
                const shouldOpen = item === parentItem && !isOpen;
                item.classList.toggle('active', shouldOpen);
                itemButton.setAttribute('aria-expanded', String(shouldOpen));
                itemButton.querySelector('span').textContent = shouldOpen ? '-' : '+';
                if (itemAnswer) {
                    itemAnswer.classList.toggle('is-open', shouldOpen);
                }
            });
        });
    });
}

function initFaqSearch() {
    const searchInput = document.getElementById('helpSearch');
    const searchButton = document.getElementById('searchBtn');
    const faqItems = document.querySelectorAll('.faq-item');

    const applySearch = function () {
        const searchText = (searchInput?.value || '').trim().toLowerCase();

        faqItems.forEach(function (item) {
            const questionText = item.querySelector('.faq-question')?.textContent || '';
            const matches = !searchText || questionText.toLowerCase().includes(searchText);
            item.style.display = matches ? '' : 'none';
        });
    };

    searchInput?.addEventListener('input', applySearch);
    searchButton?.addEventListener('click', applySearch);
}

function initSupportForm() {
    const form = document.getElementById('supportForm');
    const textarea = document.getElementById('supportMessage');
    const categorySelector = document.getElementById('supportCategory');

    if (!form || !textarea || !categorySelector) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const message = textarea.value.trim();
        const category = categorySelector.value || 'General Support';

        if (!message) {
            showHelpFeedback('Please enter a message before sending.', 'error');
            textarea.focus();
            return;
        }

        const user = getCurrentUser();
        const supportRequest = {
            id: `SUP-${Date.now()}`,
            userId: user?.id || 'guest-user',
            userName: user?.fullName || user?.name || user?.username || 'Unknown user',
            email: user?.email || 'not-available@example.com',
            category,
            message,
            createdAt: new Date().toISOString(),
            status: 'unread'
        };

        try {
            const supportMessages = readJson(SUPPORT_MESSAGES_KEY, []);
            writeJson(SUPPORT_MESSAGES_KEY, [supportRequest, ...supportMessages]);

            const notifications = readJson(ADMIN_NOTIFICATIONS_KEY, []);
            writeJson(ADMIN_NOTIFICATIONS_KEY, [{
                id: `NT-${Date.now()}`,
                userId: supportRequest.userId,
                title: category === 'Crypto Issue' ? 'New Crypto Support Request' : 'New support message',
                message: `${supportRequest.userName} submitted a support request.`,
                category,
                createdAt: supportRequest.createdAt,
                read: false,
                type: 'support'
            }, ...notifications]);

            form.reset();
            showHelpFeedback('Thanks for contacting TransWallet. Our support team will review your message shortly.', 'success');
        } catch (error) {
            showHelpFeedback('We could not send your message right now. Please try again.', 'error');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initFaqAccordion();
    initFaqSearch();
    initSupportForm();
});

