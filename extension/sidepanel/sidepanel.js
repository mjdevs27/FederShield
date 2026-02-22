document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const stepDataset = document.getElementById('step-dataset');
    const stepTrain = document.getElementById('step-train');
    const stepPR = document.getElementById('step-pr');

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectFilesBtn = document.getElementById('select-files-btn');
    const healthPanel = document.getElementById('dataset-health');

    const startTrainBtn = document.getElementById('start-train-btn');
    const trainingProgress = document.getElementById('training-progress-container');
    const trainingFill = document.getElementById('training-fill');
    const epochStatus = document.getElementById('epoch-status');
    const lossVal = document.getElementById('loss-val');

    const submitPRBtn = document.getElementById('submit-pr-btn');
    const feedList = document.getElementById('feed-list');

    // State
    let session = null;
    let datasetReady = false;
    let trained = false;

    // Load Session
    chrome.storage.local.get(['session'], (res) => {
        if (res.session) {
            session = res.session;
            document.getElementById('current-model-badge').textContent = `${session.modelName} v1.0.4`;
            addFeedItem(`Session restored for ${session.modelName}.`, 'system');
        }
    });

    // Step 1: Dataset Logic
    selectFilesBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;

        // Simulate validation
        addFeedItem(`Validating ${files.length} files...`, 'system');

        setTimeout(() => {
            datasetReady = true;
            healthPanel.classList.remove('hidden');
            dropZone.classList.add('hidden');

            // Update dummy stats
            document.getElementById('sample-count').textContent = (files.length * 120).toLocaleString();

            // Generate dummy histogram
            const histogram = document.getElementById('histogram');
            histogram.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${Math.random() * 100}%`;
                histogram.appendChild(bar);
            }

            // Enable next step
            stepTrain.classList.remove('disabled');
            startTrainBtn.disabled = false;
            addFeedItem("Dataset validated. Ready for local training.", "system");
        }, 1500);
    }

    // Step 2: Training Logic (Mock)
    startTrainBtn.addEventListener('click', () => {
        startTrainBtn.disabled = true;
        trainingProgress.classList.remove('hidden');
        addFeedItem("Starting WebGPU head-only training...", "system");

        let progress = 0;
        let epoch = 1;
        const interval = setInterval(() => {
            progress += 2;
            trainingFill.style.width = `${progress}%`;

            // Mock loss calculation
            const loss = (1.2 / (progress / 10 + 1)).toFixed(3);
            lossVal.textContent = `Loss: ${loss}`;

            if (progress % 20 === 0 && epoch < 5) {
                epoch++;
                epochStatus.textContent = `Epoch ${epoch}/5`;
            }

            if (progress >= 100) {
                clearInterval(interval);
                trainingComplete();
            }
        }, 100);
    });

    function trainingComplete() {
        trained = true;
        addFeedItem("Local training complete. Delta generated.", "system");
        stepPR.classList.remove('disabled');
        submitPRBtn.disabled = false;
    }

    // Step 3: Model PR Logic
    submitPRBtn.addEventListener('click', () => {
        submitPRBtn.disabled = true;
        submitPRBtn.textContent = "Uploading Delta...";

        setTimeout(() => {
            addFeedItem("Model PR #421 submitted to aggregator.", "system");
            submitPRBtn.textContent = "Accepted ✓";
            submitPRBtn.style.background = "var(--accent)";

            // Simulate live updates from federation
            simulateFederationActivity();
        }, 2000);
    });

    function addFeedItem(text, type = 'normal') {
        const item = document.createElement('div');
        item.className = `feed-item ${type}`;
        item.innerHTML = `
      <span class="time">Just now</span>
      <p>${text}</p>
    `;
        feedList.prepend(item);
    }

    function simulateFederationActivity() {
        const messages = [
            "Aggregation started for v1.0.5",
            "Node 0x55... submitted an update",
            "Encryption layer verified for PR #421",
            "Global model v1.0.5 published!",
            "Auto-upgrading local runtime to v1.0.5..."
        ];

        let i = 0;
        const feedInterval = setInterval(() => {
            addFeedItem(messages[i]);
            i++;
            if (i >= messages.length) {
                clearInterval(feedInterval);
                // Step 7: Auto-Upgrade
                document.getElementById('current-model-badge').textContent = `${session.modelName} v1.0.5`;
                document.getElementById('current-model-badge').style.background = "var(--primary)";
            }
        }, 3000);
    }
});
