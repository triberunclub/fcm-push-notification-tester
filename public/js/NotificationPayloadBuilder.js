/**
 * Class responsible for building notification payloads for iOS and Android platforms.
 */
export class NotificationPayloadBuilder {
    /**
     * Creates an instance of NotificationPayloadBuilder.
     * @param {NotificationManager} notificationManager - The notification manager instance.
     */
    constructor(notificationManager) {
      this.notificationManager = notificationManager;
      this.customDataFields = document.getElementById('customDataFields');
      this.setupEventListeners();
    }
  
    /**
     * Sets up event listeners for adding custom data fields and building the payload.
     */
    setupEventListeners() {
        const buildButton = document.getElementById('buildPayload');
        if (buildButton) {
            buildButton.addEventListener('click', () => this.buildAndApplyPayload());
        }

        const addCustomDataButton = document.getElementById('addCustomDataField');
        if (addCustomDataButton) {
            addCustomDataButton.addEventListener('click', () => this.addCustomDataField());
        }

        const resetBuilder = document.getElementById('resetBuilder');
        if (resetBuilder) {
            resetBuilder.addEventListener('click', () => {
                this.resetForm();
            });
        }
    }

    /**
     * Adds a new custom data field to the UI.
     */
    addCustomDataField() {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'custom-data-field';
        fieldDiv.innerHTML = `
            <input type="text" class="custom-data-key" placeholder="Key">
            <input type="text" class="custom-data-value" placeholder="Value">
            <button class="remove-custom-data">Remove</button>
        `;

        const removeButton = fieldDiv.querySelector('.remove-custom-data');
        removeButton.addEventListener('click', () => fieldDiv.remove());

        this.customDataFields.appendChild(fieldDiv);
    }

    buildAndApplyPayload() {
        const payload = this.buildPayload();
        this.notificationManager.notificationDataTextarea.value = JSON.stringify(payload, null, 2);
        this.notificationManager.closeModal();
    }
  
    /**
     * Builds the notification payload based on user input and selected platform.
     */
    buildPayload() {
        const platform = document.getElementById('platformSelect').value;
        const title = document.getElementById('notificationTitle').value;
        const body = document.getElementById('notificationBody').value;
        const sound = document.getElementById('notificationSound').value;
        const badge = parseInt(document.getElementById('notificationBadge').value) || 0;
        const icon = document.getElementById('notificationIcon').value;
        const color = document.getElementById('notificationColor').value;
        const contentAvailable = document.getElementById('notificationContentAvailable').checked;

        let payload;

        if (platform === 'ios') {
            payload = {
                aps: {
                    alert: {
                        title: title,
                        body: body
                    },
                    badge: badge,
                    sound: sound === 'none' ? null : (sound === 'default' ? 'default' : sound)
                }
            };

            if (contentAvailable) {
                payload.aps['content-available'] = 1;
            }
        } else if (platform === 'android') {
            payload = {
                notification: {
                    title: title,
                    body: body
                },
                android: {
                    notification: {
                        icon: icon,
                        color: color,
                        sound: sound === 'none' ? null : (sound === 'default' ? 'default' : sound)
                    }
                }
            };
        }

        // Add custom data
        const customData = this.getCustomData();
        if (Object.keys(customData).length > 0) {
            if (platform === 'ios') {
                payload.custom_data = customData;
            } else if (platform === 'android') {
                payload.data = customData;
            }
        }

        return payload;
    }

    /**
     * Collects custom data from the UI fields.
     * @returns {Object} An object containing the custom data key-value pairs.
     */
    getCustomData() {
        const customData = {};
        const fields = this.customDataFields.querySelectorAll('.custom-data-field');
        
        fields.forEach(field => {
            const key = field.querySelector('.custom-data-key').value.trim();
            const value = field.querySelector('.custom-data-value').value.trim();
            if (key && value) {
                customData[key] = value;
            }
        });

        return customData;
    }

    resetForm() {
        // Reset title and body
        document.getElementById('notificationTitle').value = '';
        document.getElementById('notificationBody').value = '';

        // Reset sound to default
        document.getElementById('notificationSound').value = 'default';

        // Reset badge to 1
        document.getElementById('notificationBadge').value = '1';

        // Reset icon and color (for Android)
        document.getElementById('notificationIcon').value = '';
        document.getElementById('notificationColor').value = '#000000';

        // Uncheck content available
        document.getElementById('notificationContentAvailable').checked = false;

        // Clear custom data fields
        const customDataFields = document.getElementById('customDataFields');
        customDataFields.innerHTML = '';

        console.log('Notification builder form reset');
    }
  }