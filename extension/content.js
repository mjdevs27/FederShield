// Content Script for FederShield
// Bridges the gap between the browser IDE and the extension

console.log('FederShield Content Script Active');

// Listen for messages from the webpage (the IDE)
window.addEventListener('message', (event) => {
    // Security: only accept messages from the current origin
    if (event.source !== window) return;

    if (event.data.type && event.data.type === 'FEDERSHIELD_START_TRAINING') {
        console.log('IDE requested training start via FederShield');

        // Relay to extension background or sidepanel
        chrome.runtime.sendMessage({
            type: 'IDE_ACTION',
            action: 'START_TRAIN',
            data: event.data.payload
        });
    }
});

// Inject a bridge object into the IDE's environment if needed
// This allows the IDE code to do: window.federShield.submitUpdate(...)
function injectBridge() {
    const script = document.createElement('script');
    script.textContent = `
    window.federShield = {
      isExtensionActive: true,
      submitUpdate: (data) => {
        window.postMessage({ type: 'FEDERSHIELD_SUBMIT_UPDATE', payload: data }, '*');
      }
    };
  `;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

injectBridge();
