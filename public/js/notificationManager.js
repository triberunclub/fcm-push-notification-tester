// File: public/js/notificationManager.js
export class NotificationManager {
    constructor(historyManager) {
        this.resultElement = document.getElementById('result');
        this.loaderElement = document.querySelector('.loader');
        this.notificationDataTextarea = document.getElementById('notificationData');
        this.historyManager = historyManager;
        this.templates = {
            custom: '',
            newMessage: {
                aps: {
                    alert: {
                        title: "New Message",
                        body: "You have a new message!"
                    },
                    badge: 1,
                    sound: "default"
                },
                custom_data: {
                    message_id: "12345"
                }
            },
            reminder: {
                aps: {
                    alert: {
                        title: "Reminder",
                        body: "Don't forget your appointment today!"
                    },
                    badge: 1,
                    sound: "default"
                },
                custom_data: {
                    appointment_id: "67890"
                }
            },
            appUpdate: {
                aps: {
                    alert: {
                        title: "App Update Available",
                        body: "A new version of the app is ready to install."
                    },
                    badge: 1,
                    sound: "default"
                },
                custom_data: {
                    version: "2.0.1"
                }
            }
        };
    }

    lintJSON(jsonData) {
        try {
            JSON.parse(jsonData);
            this.showResult('JSON is valid', 'success');
        } catch (error) {
            this.showResult('Invalid JSON: ' + error.message, 'error');
        }
    }

    async sendNotification(fcmToken, jsonData) {
        this.showLoader();
        try {
            const response = await fetch('/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fcmToken, notificationData: jsonData }),
            });
            const result = await response.json();
            this.showResult(JSON.stringify(result, null, 2), result.success ? 'success' : 'error');
            this.historyManager.addToHistory(result, fcmToken, jsonData);
            return result;
        } catch (error) {
            const errorResult = { success: false, error: error.message };
            this.showResult('Error: ' + error.message, 'error');
            this.historyManager.addToHistory(errorResult, fcmToken, jsonData);
            return errorResult;
        } finally {
            this.hideLoader();
        }
    }

    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (template) {
            this.notificationDataTextarea.value = JSON.stringify(template, null, 2);
        } else {
            this.notificationDataTextarea.value = '';
        }
    }

    showResult(message, type) {
        this.resultElement.textContent = message;
        this.resultElement.className = type;
    }

    showLoader() {
        this.loaderElement.style.display = 'block';
    }

    hideLoader() {
        this.loaderElement.style.display = 'none';
    }
}