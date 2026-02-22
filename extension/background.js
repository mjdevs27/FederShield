// Background Service Worker
// Handles secure storage, notification, and mock SSE

chrome.runtime.onInstalled.addListener(() => {
    console.log('FederShield Service Worker Installed');
});

// Mock SSE Listener
// In a real app, this would use fetch(url, { ... }) with EventSource or a persistent connection
let eventInterval = null;

function startMockEvents() {
    if (eventInterval) return;

    eventInterval = setInterval(() => {
        // Randomly notify about federation events
        const events = [
            "New aggregation cycle started.",
            "Global model accuracy improved to 94.2%",
            "3 new nodes joined the federation."
        ];

        if (Math.random() > 0.7) {
            const msg = events[Math.floor(Math.random() * events.length)];
            chrome.runtime.sendMessage({ type: 'FEDERATION_EVENT', message: msg });
        }
    }, 10000);
}

startMockEvents();

// Listen for messages from content scripts or UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_SAFE_TOKEN') {
        // Only allow specific trusted origins if needed
        chrome.storage.local.get(['session'], (res) => {
            sendResponse({ token: res.session ? res.session.token : null });
        });
        return true; // async response
    }

    if (request.type === 'TRAIN_LOCAL') {
        // This could trigger Native Messaging to a Python helper in Route B
        console.log("Local training requested from content script");
    }
});
