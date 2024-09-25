const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

let firebaseApp = null;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.post('/upload-firebase-key', (req, res) => {
  try {
    const serviceAccount = req.body;
    
    // Validate the service account object
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Invalid service account format');
    }

    // Initialize or re-initialize Firebase Admin SDK
    if (firebaseApp) {
      firebaseApp.delete().then(() => {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      });
    } else {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error uploading Firebase key:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Handles the POST request to send a push notification.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.fcmToken - The FCM token of the device to send the notification to.
 * @param {string} req.body.notificationData - The notification data in JSON string format.
 * @param {string} req.body.platform - The platform of the device (ios or android).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure.
 */
app.post('/send-notification', async (req, res) => {
  // Check if Firebase is initialized
  if (!firebaseApp) {
    return res.status(400).json({ success: false, error: 'Firebase not initialized. Please upload a key first.' });
  }

  const { fcmToken, notificationData, platform } = req.body;

  try {
    let message;

    if (platform === 'ios') {
      const iosPayload = JSON.parse(notificationData);
      message = {
        token: fcmToken,
        notification: iosPayload.aps?.alert ? {
          title: iosPayload.aps.alert.title || '',
          body: iosPayload.aps.alert.body || ''
        } : undefined,
        apns: iosPayload.aps ? { payload: { aps: iosPayload.aps } } : undefined,
        data: iosPayload.custom_data || undefined,
      };
    } else if (platform === 'android') {
      const androidPayload = JSON.parse(notificationData);
      message = {
        token: fcmToken,
        notification: {
          title: androidPayload.notification.title || '',
          body: androidPayload.notification.body || ''
        },
        android: {
          notification: {
            icon: androidPayload.notification.icon,
            color: androidPayload.notification.color,
            sound: androidPayload.notification.sound,
          }
        },
        data: androidPayload.data || undefined,
      };
    } else {
      throw new Error('Invalid platform specified');
    }

    // Send notification using Firebase Admin SDK
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});