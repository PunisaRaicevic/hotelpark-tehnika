import { Capacitor } from "@capacitor/core";
import type { Messaging } from "firebase/messaging";

// Firebase Web Messaging - ONLY for web platform
// On native (Android/iOS), use Capacitor Push Notifications instead
let messaging: Messaging | null = null;
let firebaseInitialized = false;

// Initialize Firebase ONLY on web platform
async function initializeFirebaseWeb() {
  if (firebaseInitialized) return;

  // Skip Firebase Web SDK on native platforms - it doesn't work there
  if (Capacitor.isNativePlatform()) {
    console.log("[Firebase] Native platform detected - skipping Web SDK, using Capacitor Push Notifications");
    firebaseInitialized = true;
    return;
  }

  try {
    const { initializeApp } = await import("firebase/app");
    const { getMessaging } = await import("firebase/messaging");

    const firebaseConfig = {
      apiKey: "AIzaSyAG8vYe5WM_3JhXYUj9C6UIrut4FnRBAxU",
      authDomain: "hgbtapp.firebaseapp.com",
      projectId: "hgbtapp",
      storageBucket: "hgbtapp.firebasestorage.app",
      messagingSenderId: "375153203002",
      appId: "1:375153203002:android:d57aea9c9c9cd906372203",
    };

    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    console.log("[Firebase] Web messaging initialized");
  } catch (error) {
    console.warn("[Firebase] Could not initialize web messaging:", error);
  }

  firebaseInitialized = true;
}

// Auto-initialize on web (safe because we check platform)
if (typeof window !== 'undefined') {
  initializeFirebaseWeb();
}

// Wrapper for getToken that handles null messaging
const getToken = async (messagingInstance: Messaging | null, options?: { vapidKey?: string }) => {
  if (!messagingInstance) {
    console.warn("[Firebase] Messaging not available on this platform");
    return null;
  }
  const { getToken: firebaseGetToken } = await import("firebase/messaging");
  return firebaseGetToken(messagingInstance, options);
};

export { messaging, getToken };