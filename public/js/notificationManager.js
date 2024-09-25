import { NotificationPayloadBuilder } from './NotificationPayloadBuilder.js';

/**
 * Manages notification operations including sending, templating, and UI interactions.
 */
export class NotificationManager {
    /**
     * Initializes the NotificationManager.
     * @param {Object} historyManager - The history manager instance.
     */
    constructor(historyManager) {
        try {
            // DOM element references
            this.resultElement = document.getElementById('result');
            this.loaderElement = document.querySelector('.loader');
            this.notificationDataTextarea = document.getElementById('notificationData');
            this.platformSelect = document.getElementById('platformSelect');
            this.templateSelector = document.getElementById('templateSelector');

            // Modal elements
            this.modal = document.getElementById('builderModal');
            this.openModalButton = document.getElementById('openBuilderModal');
            this.closeModalButton = this.modal.querySelector('.close');
        } catch (error) {
            console.error('Error initializing DOM elements:', error);
        }

        this.historyManager = historyManager;
        
        // Notification templates
        this.templates = {
            ios: {
                default: {
                    aps: {
                        alert: {
                            title: "Default iOS Notification",
                            body: "This is a default iOS notification"
                        },
                        badge: 1,
                        sound: "default"
                    },
                    custom_data: {}
                },
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
                },
                silent: {
                    aps: {
                        "content-available": 1
                    },
                    custom_data: {
                        silent_data: "true"
                    }
                }
            },
            android: {
                default: {
                    notification: {
                        title: "Default Android Notification",
                        body: "This is a default Android notification"
                    },
                    data: {}
                },
                newMessage: {
                    notification: {
                        title: "New Message",
                        body: "You have a new message!"
                    },
                    data: {
                        message_id: "12345"
                    }
                },
                reminder: {
                    notification: {
                        title: "Reminder",
                        body: "Don't forget your appointment today!"
                    },
                    data: {
                        appointment_id: "67890"
                    }
                },
                appUpdate: {
                    notification: {
                        title: "App Update Available",
                        body: "A new version of the app is ready to install."
                    },
                    data: {
                        version: "2.0.1"
                    }
                },
                silent: {
                    notification: {
                        title: "Silent Notification",
                        body: "This is a silent notification."
                    },
                    data: {
                        silent_data: "true"
                    }
                }
            }
        };

        this.setupEventListeners();
        this.loadNotificationBuilder();
    }

    // Event Listeners
    /**
     * Sets up event listeners for UI elements.
     */
    setupEventListeners() {
        this.templateSelector.addEventListener('change', (e) => {
            this.loadTemplate(e.target.value);
            this.toggleBuilderButton(e.target.value);
        });
        this.openModalButton.addEventListener('click', () => this.openModal());
        this.closeModalButton.addEventListener('click', () => this.closeModal());
        this.platformSelect.addEventListener('change', () => this.onPlatformChange());
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });
    }


    toggleBuilderButton(templateValue) {
        if (templateValue === 'custom') {
            this.openModalButton.style.display = 'inline-block';
        } else {
            this.openModalButton.style.display = 'none';
        }
    }

    /**
     * Asynchronously loads the notification builder HTML and initializes the payload builder.
     * This method fetches the HTML content for the notification builder, inserts it into the page,
     * and sets up the necessary components.
     */
    async loadNotificationBuilder() {
        console.log('Starting to load notification builder');
        try {
            const response = await fetch('html/notificationBuilder.html');
            console.log('Fetch response:', response);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            console.log('Fetched HTML content length:', html.length);
            console.log('First 100 characters of HTML:', html.substring(0, 100));
            
            const container = document.getElementById('notificationBuilderContainer');
            console.log('Container element:', container);
            
            if (!container) {
                throw new Error('notificationBuilderContainer not found in the DOM');
            }
            
            container.innerHTML = html;
            console.log('HTML inserted into container. New innerHTML length:', container.innerHTML.length);
            
            // Initialize the payload builder after the HTML is loaded
            this.payloadBuilder = new NotificationPayloadBuilder(this);
            console.log('NotificationPayloadBuilder initialized');
        } catch (error) {
            console.error('Failed to load notification builder:', error);
        }
    }

    openModal() {
        console.log('Attempting to open modal');
        const modal = document.getElementById('builderModal');
        console.log('Modal element:', modal);
        
        if (modal) {
            modal.style.display = 'block';
            console.log('Modal display set to block');
            
            const content = modal.querySelector('.modal-content');
            console.log('Modal content element:', content);
            
            if (content) {
                console.log('Modal content innerHTML length:', content.innerHTML.length);
                console.log('First 100 characters of modal content:', content.innerHTML.substring(0, 100));
            }
        } else {
            console.error('Modal element not found');
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        if (this.payloadBuilder) {
            this.payloadBuilder.resetForm();
        }
        console.log('Modal closed and form reset');
    }

    /**
     * Handles platform change event.
     */
    onPlatformChange() {
        this.loadTemplate('default');
        this.templateSelector.value = 'default';
    }

    // JSON Operations
    /**
     * Lints the provided JSON data.
     * @param {string} jsonData - The JSON string to lint.
     */
    lintJSON(jsonData) {
        try {
            // Parse the JSON to validate it
            const parsedData = JSON.parse(jsonData);
            
            // Format the JSON with indentation
            const formattedJSON = JSON.stringify(parsedData, null, 2);
            
            // Update the textarea with the formatted JSON
            this.notificationDataTextarea.value = formattedJSON;
            
            this.showResult('JSON is valid and has been formatted', 'success');
        } catch (error) {
            this.showResult('Invalid JSON: ' + error.message, 'error');
        }
    }

    // Notification Operations
    /**
     * Sends a notification.
     * @param {string} fcmToken - The FCM token to send the notification to.
     * @param {string} jsonData - The notification data in JSON format.
     * @returns {Promise<Object>} The result of the notification send operation.
     */
    async sendNotification(fcmToken, jsonData) {
        this.showLoader();
        try {
            const platform = this.platformSelect.value;
            const response = await fetch('/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fcmToken, notificationData: jsonData, platform }),
            });
            const result = await response.json();
            this.showResult(JSON.stringify(result, null, 2), result.success ? 'success' : 'error');
            this.historyManager.addToHistory(result, fcmToken, jsonData, platform);
            return result;
        } catch (error) {
            const errorResult = { success: false, error: error.message };
            this.showResult('Error: ' + error.message, 'error');
            this.historyManager.addToHistory(errorResult, fcmToken, jsonData, this.platformSelect.value);
            return errorResult;
        } finally {
            this.hideLoader();
        }
    }

    /**
     * Loads a notification template.
     * @param {string} templateName - The name of the template to load.
     */
    loadTemplate(templateName) {
        const platform = this.platformSelect.value;
        const template = this.templates[platform][templateName];
        if (template) {
            this.notificationDataTextarea.value = JSON.stringify(template, null, 2);
        } else {
            this.notificationDataTextarea.value = '';
        }

        // Toggle button visibility here as well
        this.toggleBuilderButton(templateName);
    }

    // UI Operations
    /**
     * Shows the result of an operation.
     * @param {string} message - The message to display.
     * @param {string} type - The type of the message (e.g., 'success', 'error').
     */
    showResult(message, type) {
        this.resultElement.textContent = message;
        this.resultElement.className = type;
    }

    /**
     * Shows the loader element.
     */
    showLoader() {
        this.loaderElement.style.display = 'block';
    }

    /**
     * Hides the loader element.
     */
    hideLoader() {
        this.loaderElement.style.display = 'none';
    }
}