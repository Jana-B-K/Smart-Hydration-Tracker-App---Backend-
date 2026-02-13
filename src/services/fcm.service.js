import admin from 'firebase-admin';

let fcmEnabled = false;

function initializeFirebase() {
  if (admin.apps.length > 0) {
    fcmEnabled = true;
    return;
  }

  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      fcmEnabled = true;
      return;
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      fcmEnabled = true;
      return;
    }

    console.warn('FCM is disabled: missing Firebase credentials');
  } catch (err) {
    console.warn('FCM initialization failed:', err.message);
  }
}

initializeFirebase();

export async function sendPushNotification(token) {
  console.log("entered push notification")
  if (process.env.MOCK_FCM === 'true') {
    console.log('[MOCK_FCM] reminder sent to token:', token || '[empty]');
    return true;
  }
  
  if (!token) {
    console.warn('FCM delivery skipped: missing user fcmToken');
    return false;
  }

  if (!fcmEnabled) {
    console.warn('FCM delivery skipped: Firebase is not initialized');
    return false;
  }

  const message = {
    notification: {
      title: 'Hydration Reminder',
      body: 'Time to drink water',
    },
    token,
  };

  try {
    await admin.messaging().send(message);
    return true;
  } catch (err) {
    console.error('Failed to send push notification:', err.message);
    return false;
  }
}
