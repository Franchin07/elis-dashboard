/*
    Si ho usato Gemini per il Javascript, ora shut up
*/
document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);
    const toggleBtn = $('toggle-iframe-btn'), toggleText = $('toggle-iframe-text');
    const residentBtn = $('toggle-resident-btn'), residentText = $('toggle-resident-text');
    const iframeView = $('iframe-view'), iframe = $('app-iframe'), closeIframeBtn = $('close-iframe-btn');
    const cards = document.querySelectorAll('.card');
    const residentCards = document.querySelectorAll('.resident-item');
    const externalCards = document.querySelectorAll('.external-item');

    let iframeMode = localStorage.getItem('iframeMode') || (window.innerWidth <= 640 ? 'off' : 'mixed');
    let residentMode = localStorage.getItem('residentMode') || 'off';
    if (iframeMode === 'mixed') document.body.classList.add('mode-mixed');
    if (residentMode === 'off') document.body.classList.add('mode-off');

    const setScrollLock = (locked) => { document.body.style.overflow = locked ? 'hidden' : ''; };

    function updateToggleUI() {
        toggleBtn.classList.remove('mode-off', 'mode-mixed');
        const isMixed = iframeMode === 'mixed';
        toggleBtn.classList.add(isMixed ? 'mode-mixed' : 'mode-off');
        toggleText.textContent = isMixed ? 'Iframe: Attivato' : 'Iframe: Disattivato';
    }

    function updateCollegeUI() {
        const isOn = residentMode === 'on';
        residentBtn.classList.toggle('mode-on', isOn);
        residentBtn.classList.toggle('mode-off', !isOn);
        residentText.textContent = isOn ? 'Residente: si' : 'Residente: no';
        residentCards.forEach((c) => c.classList.toggle('hidden', !isOn));
        externalCards.forEach((c) => c.classList.toggle('hidden', isOn));
    }

    updateToggleUI();
    updateCollegeUI();

    toggleBtn?.addEventListener('click', () => {
        iframeMode = iframeMode === 'off' ? 'mixed' : 'off';
        document.body.classList.toggle('mode-mixed', iframeMode === 'mixed');
        localStorage.setItem('iframeMode', iframeMode);
        updateToggleUI();
    });

    residentBtn?.addEventListener('click', () => {
        residentMode = residentMode === 'off' ? 'on' : 'off';
        localStorage.setItem('residentMode', residentMode);
        updateCollegeUI();
    });

    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            if (iframeMode === 'mixed' && !card.classList.contains('no-iframe')) {
                e.preventDefault();
                if (iframe && iframeView) {
                    iframe.src = card.getAttribute('href');
                    iframeView.classList.remove('hidden');
                    setScrollLock(true);
                }
            }
        });
    });

    closeIframeBtn?.addEventListener('click', () => {
        if (!iframeView) return;
        iframeView.classList.add('hidden');
        iframe.src = '';
        setScrollLock(false);
    });

    function bindOverlay({ openBtn, closeBtn, overlay, activeClass, onBeforeOpen }) {
        if (!openBtn || !closeBtn || !overlay) return;
        const close = () => { overlay.classList.remove(activeClass); setScrollLock(false); };
        openBtn.addEventListener('click', (e) => {
            if (onBeforeOpen && onBeforeOpen(e) === false) return;
            overlay.classList.add(activeClass);
            setScrollLock(true);
        });
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains(activeClass)) close(); });
    }

    const calendarUrl = 'https://outlook.office365.com/owa/calendar/1b311367f78e4c6592e438e82269cf44@edu.elis.org/716b4f1c29ed4ff1be8d42a6c4f1bf3b11803823812295274568/calendar.html';
    bindOverlay({
        openBtn: $('open-calendar-btn'),
        closeBtn: $('close-calendar-btn'),
        overlay: $('sidebar-overlay'),
        activeClass: 'active',
        onBeforeOpen: (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                window.open(calendarUrl, '_blank');
                return false;
            }
            $('calendar-sidebar')?.classList.add('open');
        }
    });

    // Chiusura sidebar calendario sincronizzata con l'overlay
    const sidebar = $('calendar-sidebar'), overlay = $('sidebar-overlay');
    if (sidebar && overlay) {
        const syncClose = () => sidebar.classList.remove('open');
        $('close-calendar-btn')?.addEventListener('click', syncClose);
        overlay.addEventListener('click', syncClose);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sidebar.classList.contains('open')) syncClose(); });
    }

    bindOverlay({ openBtn: $('open-email-btn'), closeBtn: $('close-email-btn'), overlay: $('email-modal-overlay'), activeClass: 'active' });
    bindOverlay({ openBtn: $('open-files-btn'), closeBtn: $('close-files-btn'), overlay: $('files-modal-overlay'), activeClass: 'active' });

    document.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const email = btn.getAttribute('data-email');
            if (!email) return;
            navigator.clipboard.writeText(email).then(() => {
                const icon = btn.querySelector('i');
                btn.classList.add('copied');
                icon.className = 'fa-solid fa-check';
                setTimeout(() => { btn.classList.remove('copied'); icon.className = 'fa-regular fa-copy'; }, 2000);
            }).catch((err) => console.error('Errore durante la copia: ', err));
        });
    });
});