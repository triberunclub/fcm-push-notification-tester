// File: public/js/firebaseConfigManager.js
export class FirebaseConfigManager {
    constructor() {
        this.fileInput = document.getElementById('firebaseKeyFile');
        this.uploadButton = document.getElementById('uploadKeyButton');
        this.keyStatus = document.getElementById('keyStatus');
        this.sendButton = document.getElementById('sendButton');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.uploadButton.addEventListener('click', () => this.uploadKey());
        this.fileInput.addEventListener('change', () => this.toggleUploadButton());
    }

    toggleUploadButton() {
        this.uploadButton.disabled = !this.fileInput.files.length;
    }

    async uploadKey() {
        const file = this.fileInput.files[0];
        if (!file) {
            this.updateStatus('Please select a file first.', 'error');
            return;
        }

        const fileContent = await this.readFile(file);
        
        try {
            const response = await fetch('/upload-firebase-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: fileContent,
            });

            const result = await response.json();
            if (result.success) {
                this.updateStatus('Firebase key uploaded successfully!', 'success');
                this.enableSendButton();
            } else {
                this.updateStatus('Failed to upload Firebase key: ' + result.error, 'error');
            }
        } catch (error) {
            this.updateStatus('Error uploading Firebase key: ' + error.message, 'error');
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    updateStatus(message, type) {
        this.keyStatus.textContent = message;
        this.keyStatus.className = type;
    }

    enableSendButton() {
        this.sendButton.disabled = false;
    }
}