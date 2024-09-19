export function setupEventListeners(notificationManager, historyManager, firebaseConfigManager) {
    const lintButton = document.getElementById('lintButton');
    const sendButton = document.getElementById('sendButton');
    const uploadKeyButton = document.getElementById('uploadKeyButton');
    const templateSelector = document.getElementById('templateSelector');
    const fcmTokenInput = document.getElementById('fcmToken');
    const notificationDataTextarea = document.getElementById('notificationData');

    lintButton.addEventListener('click', () => {
        const jsonData = notificationDataTextarea.value;
        notificationManager.lintJSON(jsonData);
    });

    sendButton.addEventListener('click', async () => {
        const fcmToken = fcmTokenInput.value;
        const jsonData = notificationDataTextarea.value;
        await notificationManager.sendNotification(fcmToken, jsonData);
        // We don't need to manually add to history here anymore
    });

    templateSelector.addEventListener('change', (e) => {
        notificationManager.loadTemplate(e.target.value);
        validateInputs(); // Revalidate inputs after loading a template
    });

    // Disable send button initially
    sendButton.disabled = true;

    // Add input validation
    fcmTokenInput.addEventListener('input', validateInputs);
    notificationDataTextarea.addEventListener('input', validateInputs);

    function validateInputs() {
        const isTokenValid = fcmTokenInput.value.trim() !== '';
        const isDataValid = notificationDataTextarea.value.trim() !== '';
        const isKeyUploaded = !uploadKeyButton.disabled;

        sendButton.disabled = !(isTokenValid && isDataValid && isKeyUploaded);
    }

    // Initial template load
    notificationManager.loadTemplate(templateSelector.value);
}