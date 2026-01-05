const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('results');
const analysisContainer = document.getElementById('analysis-container');
const analysisContent = document.getElementById('analysis-content');
const loader = document.getElementById('loader');
const fileInfo = document.getElementById('file-info');
const textInput = document.getElementById('textInput');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let selectedFile = null;
let activeMode = 'upload'; // 'upload' or 'paste'

// Tabs Logic
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const targetId = `tab-${tab.dataset.tab}`;
        document.getElementById(targetId).classList.add('active');
        activeMode = tab.dataset.tab;
    });
});

// File Handling
dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = '#0f172a'; });
dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = '#e2e8f0'; });
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#e2e8f0';
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => { if (e.target.files.length) handleFile(e.target.files[0]); });

function handleFile(file) {
    selectedFile = file;
    fileInfo.textContent = `Selected: ${file.name}`;
    fileInfo.classList.remove('hidden');
}

// Analyze
analyzeBtn.addEventListener('click', async () => {
    // Validation
    if (activeMode === 'upload' && !selectedFile) {
        showError('Please select a file to analyze.');
        return;
    }
    if (activeMode === 'paste' && !textInput.value.trim()) {
        showError('Please paste some text to analyze.');
        return;
    }

    // UI Reset
    resultsSection.classList.remove('hidden');
    loader.classList.remove('hidden');
    analysisContainer.classList.add('hidden');
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
    
    try {
        let response;

        if (activeMode === 'upload') {
            const formData = new FormData();
            formData.append('document', selectedFile);
            response = await fetch('/analyze', { method: 'POST', body: formData });
        } else {
            response = await fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textInput.value })
            });
        }

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            renderResults(data.analysis);
            loader.classList.add('hidden');
            analysisContainer.classList.remove('hidden');
            
            // Save report to Firebase
            const inputText = activeMode === 'upload' ? data.textPreview : textInput.value;
            const fileName = activeMode === 'upload' ? selectedFile?.name : null;
            await saveCurrentReport(data.analysis, inputText, activeMode, fileName);
        } else {
            throw new Error(data.error || 'Analysis failed');
        }

    } catch (error) {
        console.error('Analysis error:', error);
        loader.classList.add('hidden');
        showError(`Analysis failed: ${error.message}. Please try again.`);
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze Risk Level';
    }
});

// Error display helper
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.classList.add('show'), 10);
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
}

// Success display helper
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-toast';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => successDiv.classList.add('show'), 10);
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

function renderResults(risks) {
    analysisContent.innerHTML = '';

    risks.forEach((risk, index) => {
        const card = document.createElement('div');
        
        // Determine CSS class based on risk level
        let cssClass = 'safe';
        if (risk.riskLevel === 'High') cssClass = 'high-risk';
        if (risk.riskLevel === 'Medium') cssClass = 'med-risk';

        card.className = `card ${cssClass}`;
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="card-header">
                <h3>${risk.label}</h3>
                <span class="status-badge">${risk.riskLevel} Risk</span>
            </div>
            <div class="card-body">
                <div class="clause-box">"${risk.clause}"</div>
                
                <div class="friendly-section">
                    <div class="friendly-item">
                        <h4>1️⃣ What this means</h4>
                        <p>${risk.whatItMeans || risk.whyRisky}</p>
                    </div>
                    
                    <div class="friendly-item">
                        <h4>2️⃣ Why it can be harmful</h4>
                        <p>${risk.whyHarmful || risk.whyRisky}</p>
                    </div>
                    
                    <div class="friendly-item highlight-box">
                        <h4>3️⃣ If you continue</h4>
                        <p class="loss-highlight">${risk.realExample || risk.futureLoss}</p>
                    </div>
                </div>

                ${risk.saferAlternative && risk.saferAlternative !== 'N/A' ? `
                <div class="rewrite-box">
                    <h4>4️⃣ Safer alternative</h4>
                    <p>${risk.saferAlternative || risk.rewrite}</p>
                </div>
                ` : ''}
            </div>
        `;

        analysisContent.appendChild(card);
    });
}

// Firebase Integration
const loginBtn = document.getElementById('loginBtn');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');

// Login button handler
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        await signInWithGoogle();
    });
}

// Gemini Test button handler
const testGeminiBtn = document.getElementById('testGeminiBtn');
if (testGeminiBtn) {
    testGeminiBtn.addEventListener('click', async () => {
        testGeminiBtn.disabled = true;
        testGeminiBtn.textContent = '🔄 Testing...';
        
        try {
            const response = await fetch('/api/test-gemini');
            const data = await response.json();
            
            if (data.success) {
                showSuccess(`✅ Gemini API Working!\n\n${data.response}`);
            } else {
                // Show specific error from server, or fallback
                showError(`❌ ${data.error || data.message || 'Gemini API not configured'}`);
            }
        } catch (error) {
            showError(`❌ Test failed: ${error.message}`);
        } finally {
            testGeminiBtn.disabled = false;
            testGeminiBtn.textContent = '🤖 Test AI';
        }
    });
}

// History button handler
if (historyBtn) {
    historyBtn.addEventListener('click', async () => {
        if (!currentUser) {
            alert('Please sign in to view history');
            return;
        }
        
        historyModal.classList.remove('hidden');
        await loadHistory();
    });
}

// Close modal
if (closeHistoryModal) {
    closeHistoryModal.addEventListener('click', () => {
        historyModal.classList.add('hidden');
    });
}

// Close modal on outside click
historyModal?.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.classList.add('hidden');
    }
});

// Save report after analysis
async function saveCurrentReport(analysis, inputText, inputType, fileName) {
    if (!currentUser || !isFirebaseConfigured) {
        console.log('Skipping save: Not signed in or Firebase not configured');
        return;
    }
    
    const reportData = {
        inputText: inputText.substring(0, 500), // Limit text size
        inputType,
        fileName: fileName || null,
        analysis,
        timestamp: new Date().toISOString()
    };
    
    try {
        const saved = await saveReport(reportData);
        if (saved) {
            console.log('Report saved successfully');
        }
    } catch (error) {
        console.error('Failed to save report:', error);
    }
}

// Load and display history
async function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '<p class="loading">Loading history...</p>';
    
    const reports = await fetchHistory();
    
    if (reports.length === 0) {
        historyList.innerHTML = '<p class="empty">No analysis history yet. Start by analyzing a document!</p>';
        return;
    }
    
    historyList.innerHTML = '';
    reports.forEach(report => {
        const card = document.createElement('div');
        card.className = 'history-card';
        
        const date = report.timestamp?.toDate ? report.timestamp.toDate() : new Date(report.timestamp);
        const dateStr = date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const riskCount = report.analysis?.length || 0;
        const preview = report.inputText?.substring(0, 100) || 'No preview available';
        
        card.innerHTML = `
            <div class="history-header">
                <span class="history-date">${dateStr}</span>
                <span class="history-type">${report.inputType === 'upload' ? '📄 Upload' : '📝 Paste'}</span>
            </div>
            <p class="history-preview">${preview}...</p>
            <div class="history-footer">
                <span class="history-risks">${riskCount} risk(s) detected</span>
                <button class="btn-view-report" data-report-id="${report.id}">View Report</button>
            </div>
        `;
        
        historyList.appendChild(card);
    });
    
    // Add click handlers to view buttons
    document.querySelectorAll('.btn-view-report').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const reportId = e.target.dataset.reportId;
            await viewReport(reportId);
        });
    });
}

// View a specific report
async function viewReport(reportId) {
    const report = await getReport(reportId);
    
    if (!report) {
        alert('Report not found');
        return;
    }
    
    // Close history modal
    historyModal.classList.add('hidden');
    
    // Display the report
    resultsSection.classList.remove('hidden');
    analysisContainer.classList.remove('hidden');
    loader.classList.add('hidden');
    
    renderResults(report.analysis);
    
    // Optionally populate input field
    if (report.inputType === 'paste' && report.inputText) {
        textInput.value = report.inputText;
        // Switch to paste tab
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="paste"]').classList.add('active');
        document.getElementById('tab-paste').classList.add('active');
        activeMode = 'paste';
    }
}
