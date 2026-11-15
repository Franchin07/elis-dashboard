/*
    Si ho usato Gemini per il Javascript, ora shut up
*/
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-iframe-btn');
    const toggleText = document.getElementById('toggle-iframe-text');
    const residentBtn = document.getElementById('toggle-resident-btn');
    const residentText = document.getElementById('toggle-resident-text');
    const iframeView = document.getElementById('iframe-view');
    const iframe = document.getElementById('app-iframe');
    const closeBtn = document.getElementById('close-iframe-btn');
    const cards = document.querySelectorAll('.card');
    const residentCards = document.querySelectorAll('.resident-item');
    

    let iframeMode = localStorage.getItem('iframeMode') || 'mixed';
    if (iframeMode == 'mixed') document.body.classList.add('mode-mixed');
    let residentMode = localStorage.getItem('residentMode') || 'off';
    if (residentMode == 'off') document.body.classList.add('mode-off');

    // Funzione per aggiornare l'aspetto e il testo del pulsante
    function updateToggleUI() {
        toggleBtn.classList.remove('mode-off', 'mode-mixed');
        
        if (iframeMode === 'off') {
            toggleBtn.classList.add('mode-off');
            toggleText.textContent = 'Iframe: Disattivato';
        } else if (iframeMode === 'mixed') {
            toggleBtn.classList.add('mode-mixed');
            toggleText.textContent = 'Iframe: Attivato';
        }
    }
    function updateCollegeUI() {
        residentBtn.classList.remove('mode-off', 'mode-on');
        
        if (residentMode === 'off') {
            residentBtn.classList.add('mode-off');
            residentText.textContent = 'Residente: no';
        } else if (residentMode === 'on') {
            residentBtn.classList.add('mode-on');
            residentText.textContent = 'Residente: si';
        }

        residentCards.forEach(card => {
            if (residentMode === 'on') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Inizializza l'interfaccia all'avvio
    updateToggleUI();
    updateCollegeUI();

    // Cliccando sul pulsante si passa allo stato successivo in modo ciclico
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (iframeMode === 'off') {
                iframeMode = 'mixed';
                document.body.classList.add('mode-mixed');
            } else {
                iframeMode = 'off';
                document.body.classList.remove('mode-mixed');
            }
            
            localStorage.setItem('iframeMode', iframeMode);
            updateToggleUI();
        });
    }
    if (residentBtn) {
        residentBtn.addEventListener('click', () => {
            if (residentMode === 'off') {
                residentMode = 'on';
            } else {
                residentMode = 'off';
            }
            
            localStorage.setItem('residentMode', residentMode);
            updateCollegeUI();
        });
    }

    // Gestione dei click sulle schede della dashboard
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            let openInIframe = false;

            if (iframeMode === 'mixed') {
                // In modalità mista, usa l'iframe SOLO SE la card NON ha la classe 'no-iframe'
                if (!card.classList.contains('no-iframe')) {
                    openInIframe = true;
                }
            }
            // Se iframeMode è 'off', openInIframe rimane false (comportamento standard)

            if (openInIframe) {
                e.preventDefault();
                const targetUrl = card.getAttribute('href');

                if (iframe && iframeView) {
                    iframe.src = targetUrl;
                    iframeView.classList.remove('hidden');
                    document.body.style.overflow = 'hidden'; // Blocca lo scroll della dashboard
                }
            }
        });
    });

    // Chiusura dell'iframe e ritorno alla dashboard
    if (closeBtn && iframeView) {
        closeBtn.addEventListener('click', () => {
            iframeView.classList.add('hidden');
            iframe.src = ''; // Pulisce l'iframe
            document.body.style.overflow = ''; // Ripristina lo scroll
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-calendar-btn');
    const closeBtn = document.getElementById('close-calendar-btn');
    const sidebar = document.getElementById('calendar-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openBtn && sidebar && closeBtn && overlay) {
        openBtn.addEventListener('click', (e) => {
            // Se lo schermo è più piccolo di 768px (smartphone), apre il link diretto di Outlook
            if (window.innerWidth <= 768) {
                e.preventDefault();
                window.open('https://outlook.office365.com/owa/calendar/1b311367f78e4c6592e438e82269cf44@edu.elis.org/716b4f1c29ed4ff1be8d42a6c4f1bf3b11803823812295274568/calendar.html', '_blank');
            } else {
                // Altrimenti apre la tua sidebar con l'iframe su PC
                openSidebar();
            }
        });
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar); // Chiude cliccando sull'oscuramento

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const openEmailBtn = document.getElementById('open-email-btn');
    const closeEmailBtn = document.getElementById('close-email-btn');
    const emailOverlay = document.getElementById('email-modal-overlay');

    function openModal() {
        emailOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        emailOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openEmailBtn && closeEmailBtn && emailOverlay) {
        // Apertura al click
        openEmailBtn.addEventListener('click', openModal);

        // Chiusura con pulsante 'X'
        closeEmailBtn.addEventListener('click', closeModal);

        // Chiusura cliccando fuori dal contenuto (sull'overlay)
        emailOverlay.addEventListener('click', (e) => {
            if (e.target === emailOverlay) {
                closeModal();
            }
        });

        // Chiusura tramite tasto ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && emailOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const emailToCopy = btn.getAttribute('data-email');
            
            if (emailToCopy) {
                // Copia l'email negli appunti
                navigator.clipboard.writeText(emailToCopy).then(() => {
                    const icon = btn.querySelector('i');
                    
                    // Cambia l'icona in una spunta di conferma
                    btn.classList.add('copied');
                    icon.className = 'fa-solid fa-check';
                    
                    // Ripristina l'icona originale dopo 2 secondi
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        icon.className = 'fa-regular fa-copy';
                    }, 2000);
                }).catch(err => {
                    console.error('Errore durante la copia: ', err);
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const openFilesBtn = document.getElementById('open-files-btn');
    const closeFilesBtn = document.getElementById('close-files-btn');
    const filesOverlay = document.getElementById('files-modal-overlay');

    function openModal() {
        filesOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        filesOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openFilesBtn && closeFilesBtn && filesOverlay) {
        openFilesBtn.addEventListener('click', openModal);
        closeFilesBtn.addEventListener('click', closeModal);

        filesOverlay.addEventListener('click', (e) => {
            if (e.target === filesOverlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && filesOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
});