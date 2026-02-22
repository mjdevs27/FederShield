document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const statusSection = document.getElementById('status-section');
    const joinBtn = document.getElementById('join-btn');
    const openPanelBtn = document.getElementById('open-panel');
    const disconnectBtn = document.getElementById('disconnect');
    const modelSelect = document.getElementById('model-id');
    const activeModelSpan = document.getElementById('active-model');

    // Check existing session
    chrome.storage.local.get(['session'], (result) => {
        if (result.session) {
            showStatus(result.session.modelName);
        }
    });

    const scanBtn = document.getElementById('scan-qr');
    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            alert('Opening secure camera portal for QR analysis...');
        });
    }

    joinBtn.addEventListener('click', () => {
        const token = document.getElementById('token').value;
        const modelId = modelSelect.value;
        const modelName = modelSelect.options[modelSelect.selectedIndex].text;

        const modelMap = {
            'finbert': '3f843335-fa9d-408e-afd1-a64a9c23be4e',
            'resnet50': 'resnet50-fed-training-001',
            'gpt2-small': 'gpt2-fed-tuning-002'
        };

        // Mock join federation
        const session = {
            token: token || 'demo_token_123',
            modelId: modelId,
            notebookId: modelMap[modelId] || '3f843335-fa9d-408e-afd1-a64a9c23be4e',
            modelName: modelName.split(' ')[0],
            joinedAt: new Date().toISOString()
        };

        chrome.storage.local.set({ session }, () => {
            showStatus(session.modelName);

            // Redirect current tab to the correct notebook if on localhost:3000
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTab = tabs[0];
                if (activeTab && activeTab.url && activeTab.url.includes('localhost:3000')) {
                    const newUrl = `http://localhost:3000/dashboard/notebooks/${session.notebookId}`;
                    chrome.tabs.update(activeTab.id, { url: newUrl });
                }
            });

            chrome.sidePanel.setOptions({
                path: 'sidepanel/sidepanel.html',
                enabled: true
            });
        });
    });

    openPanelBtn.addEventListener('click', () => {
        // Open side panel
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.sidePanel.open({ tabId: tabs[0].id });
                window.close();
            }
        });
    });

    disconnectBtn.addEventListener('click', () => {
        chrome.storage.local.remove('session', () => {
            authSection.classList.remove('hidden');
            statusSection.classList.add('hidden');
        });
    });

    function showStatus(modelName) {
        activeModelSpan.textContent = modelName;
        authSection.classList.add('hidden');
        statusSection.classList.remove('hidden');
    }
});
