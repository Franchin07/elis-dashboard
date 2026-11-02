/*
    Si ho usato Gemini per il Javascript, ora shut up
*/
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-iframe-btn');
    const toggleText = document.getElementById('toggle-text');
    const iframeView = document.getElementById('iframe-view');
    const iframe = document.getElementById('app-iframe');
    const closeBtn = document.getElementById('close-iframe-btn');
    const cards = document.querySelectorAll('.card');

    // Stati possibili: 'off', 'mixed' (default: 'off')
    let iframeMode = localStorage.getItem('iframeMode') || 'mixed';
    if (iframeMode == 'mixed') document.body.classList.add('mode-mixed');

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

    // Inizializza l'interfaccia all'avvio
    updateToggleUI();

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