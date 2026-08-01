/**
 * Privacy / Terms / About / Contact popup system — shared by every page on the site.
 *
 * Include this on any page with:
 *   <script src="/assets/modals.js" defer></script>   (top-level pages)
 *   <script src="../assets/modals.js" defer></script> (pages one folder deep, e.g. /blog/*)
 *
 * Then mark any link that should open a popup instead of navigating with
 * data-modal="privacy" | "terms" | "about" | "contact", e.g.:
 *   <a href="../privacy.html" data-modal="privacy">Privacy</a>
 *
 * The href still points at the real page, so if this script fails to load,
 * or a search engine follows the link, it lands on a real, crawlable page
 * with the same content — this is progressive enhancement, not a replacement
 * for privacy.html / terms.html / about.html / contact.html.
 *
 * CONTENT below is the single copy of the popup text. Update it here once
 * and every page picks it up — nothing to keep in sync by hand. Whenever
 * this changes, mirror the same edit into privacy.html / terms.html /
 * about.html / contact.html so the real pages and the popups never drift.
 */
(function () {
    const CONTENT = {
        privacy: `
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>Your privacy is our top priority. This tool is designed to protect your primary inbox from spam.</p>
                <h3 class="text-lg font-semibold text-gray-900">Data Retention</h3>
                <p>Emails and user accounts are entirely temporary. They are automatically and permanently deleted from our servers once the timer expires. We do not store backups.</p>
                <h3 class="text-lg font-semibold text-gray-900">Lawful Use</h3>
                <p>This service is strictly for personal privacy protection. Using our service for illegal activities is prohibited.</p>
                <h3 class="text-lg font-semibold text-gray-900">Advertising &amp; Cookies</h3>
                <p>This site uses cookies for advertising and analytics, including cookies served by Google. If you're located in the European Economic Area, the UK, or Switzerland, we ask for your consent before any non-essential cookies are set, via the cookie banner shown when you first visit.</p>
                <p>We use Google AdSense to display ads. Google, as a third-party vendor, uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this site and other sites on the internet.</p>
                <p>You can opt out of personalized advertising via <a href="https://adssettings.google.com" class="text-blue-600 hover:underline" target="_blank" rel="noopener">Google's Ad Settings</a> or <a href="https://www.aboutads.info/choices" class="text-blue-600 hover:underline" target="_blank" rel="noopener">www.aboutads.info</a>. Learn more at <a href="https://policies.google.com/technologies/partner-sites" class="text-blue-600 hover:underline" target="_blank" rel="noopener">How Google uses information from sites that use our services</a>.</p>
            </div>`,
        terms: `
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>By using our temporary email service, you agree to the following conditions:</p>
                <h3 class="text-lg font-semibold text-gray-900">1. Lawful Use Only</h3>
                <p>This platform is provided strictly as a privacy tool for legitimate users looking to avoid spam and protect their digital footprint. The generation and use of temporary email addresses for illegal activities, fraud, identity theft, harassment, or malicious actions are strictly prohibited.</p>
                <h3 class="text-lg font-semibold text-gray-900">2. No Warranties</h3>
                <p>The service is provided on an "as is" and "as available" basis. We do not guarantee permanent availability or storage of emails.</p>
            </div>`,
        about: `
            <h2 class="text-2xl font-bold text-gray-900 mb-4">About Our Service</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>Welcome to your trusted digital privacy utility. In an era where online tracking and unwanted spam are ubiquitous, our goal is to give users back control over their personal information.</p>
                <h3 class="text-lg font-semibold text-gray-900">Our Mission</h3>
                <p>We built this platform to provide a disposable, temporary email address solution that helps protect your personal identity. It is designed for safe evaluation of new websites, registering for one-time gated content, or avoiding marketing spam from untrustworthy sources.</p>
                <h3 class="text-lg font-semibold text-gray-900">Committed to Safety</h3>
                <p>We strongly advocate for lawful digital hygiene. While our tool protects you from data collection, we strictly prohibit its use for any fraudulent or malicious activities.</p>
            </div>`,
        contact: `
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed text-center">
                <h3 class="text-lg font-semibold text-gray-900">Get In Touch</h3>
                <p>For privacy inquiries, support, or general questions, please reach out to us directly via email.</p>
                <p class="text-lg font-medium text-blue-600">temporaryemailsupport@gmail.com</p>
            </div>`
    };

    const gutterFix = document.createElement('style');
    gutterFix.textContent = 'html{scrollbar-gutter:stable;}';
    document.head.appendChild(gutterFix);

    const overlay = document.createElement('div');
    overlay.id = 'modalOverlay';
    overlay.className = 'hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    overlay.innerHTML =
        '<div class="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 relative">' +
            '<button type="button" aria-label="Close" class="modal-close absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">\u2715</button>' +
            '<div class="modal-body"></div>' +
        '</div>';
    document.body.appendChild(overlay);

    const modalBody = overlay.querySelector('.modal-body');
    const modalClose = overlay.querySelector('.modal-close');

    function openModal(key) {
        if (!CONTENT[key]) return;
        modalBody.innerHTML = CONTENT[key];
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        history.replaceState(null, '', '#' + key);
    }

    function closeModal() {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        history.replaceState(null, '', location.pathname);
    }

    document.addEventListener('click', function (e) {
        const link = e.target.closest('[data-modal]');
        if (!link) return;
        e.preventDefault();
        openModal(link.dataset.modal);
    });

    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
    });

    const initialHash = location.hash.replace('#', '');
    if (CONTENT[initialHash]) openModal(initialHash);
})();
