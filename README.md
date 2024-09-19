# FCM Push Notification Tester 🚀

FCM Push Notification Tester is a lightweight Node.js application that allows developers to dynamically upload their Firebase `serviceAccount.json` file and send test push notifications to a specified FCM token. This tool is designed to help developers quickly test Firebase Cloud Messaging (FCM) notifications.

## Features

- **Upload Firebase Service Account:** Dynamically upload your Firebase `serviceAccount.json` key.
- **Send Test Notifications:** Send push notifications to a specific FCM token with a customizable payload.
- **iOS Payload Support:** Easily test iOS-style push notifications.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** installed (version 14.x or above)
- A Firebase project and service account key file (`serviceAccount.json`)
- An FCM token to send test notifications to.

## Installation

Clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/your-github-account/fcm-push-notification-tester.git
cd fcm-push-notification-tester
npm install
```

## Running the Application

To start the application locally, use the following command:

```bash
node app.js
```

By default, the server will start on port 3000. You can access it at http://localhost:3000.

## API Endpoints

### 1. Upload Firebase Key

**Endpoint**: POST /upload-firebase-key

Upload the serviceAccount.json file for Firebase Admin SDK initialization.

**Request Body**:

```json
{
    "type": "service_account",
    "project_id": "your_project_id",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-abc123@your_project_id.iam.gserviceaccount.com"
 }
```

**Response**:

 ```json
{
    "success": true
}
```

### 2. Send Push Notification

**Endpoint**: POST /send-notification

Send a push notification to a specific FCM token.

**Request Body**:

```json
 {
    "fcmToken": "your-fcm-token",
    "notificationData": "{\"aps\":{\"alert\":{\"title\":\"Test Title\",\"body\":\"Test Body\"}}, \"custom_data\":{\"key1\":\"value1\"}}"
}
```

- **fcmToken**: The Firebase Cloud Messaging token of the device you want to send the notification to.
- **notificationData**: The notification payload, in iOS (APNs) format.
**Response**:

 ```json
{
  "success": true,
  "response": "MessageId"
}
```

## Example Usage

1. **Start the app**

```bash
node app.js
```

2. **Upload Firebase Key**:
Send a POST request to http://localhost:3000/upload-firebase-key with your serviceAccount.json in the request body.

3. **Send Notification**:
Send a POST request to http://localhost:3000/send-notification with the FCM token and the notification payload.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for building the API
- **Firebase Admin SDK**: For sending push notifications via Firebase Cloud Messaging (FCM)

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contribution

Feel free to fork this project, submit pull requests, or file issues for feature requests and bugs.

## Author

Developed by [Luigi Aiello](https://github.com/hihelloluigi)

## Instructions to customize

1. **Repository URL:** Replace the placeholder `https://github.com/your-github-account/fcm-push-notification-tester.git` with the actual GitHub URL of your project.
2. **Author Information:** Add your name or organization and link to your GitHub profile.
3. **Additional Sections:** If you have tests, deployment instructions, or other details, you can add them to the `README.md` as needed.

Once this file is ready, simply place it in the root directory of your repository. Let me know if you'd like to add anything else!