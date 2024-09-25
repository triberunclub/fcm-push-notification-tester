// File: public/js/historyManager.js
export class HistoryManager {
    constructor() {
        this.historyList = document.getElementById('historyList');
        this.history = [];
        this.maxHistoryItems = 10; // Limit the number of history items
    }

    addToHistory(result, fcmToken, notificationData, platform) {
        const historyItem = {
            timestamp: new Date().toLocaleString(),
            success: result.success,
            fcmToken: fcmToken,
            notificationData: notificationData,
            platform: platform,
            response: result.response || result.error
        };

        this.history.unshift(historyItem);
        if (this.history.length > this.maxHistoryItems) {
            this.history.pop();
        }

        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        this.history.forEach((item, index) => {
            const historyItemElement = document.createElement('div');
            historyItemElement.className = `historyItem ${item.success ? 'success' : 'error'}`;
            historyItemElement.innerHTML = `
                <p><strong>Timestamp:</strong> ${item.timestamp}</p>
                <p><strong>Status:</strong> ${item.success ? 'Success' : 'Failure'}</p>
                <p><strong>Platform:</strong> ${item.platform}</p>
                <p><strong>FCM Token:</strong> ${item.fcmToken}</p>
                <details>
                    <summary>Notification Data</summary>
                    <pre>${JSON.stringify(JSON.parse(item.notificationData), null, 2)}</pre>
                </details>
                <details>
                    <summary>Response</summary>
                    <pre>${JSON.stringify(item.response, null, 2)}</pre>
                </details>
            `;
            this.historyList.appendChild(historyItemElement);
        });
    }

    truncate(str, n) {
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    }
}