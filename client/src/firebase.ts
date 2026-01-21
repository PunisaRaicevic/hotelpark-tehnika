import { initializeApp } from "firebase/app";
import { getMessaging, getToken as firebaseGetToken, Messaging } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";

const firebaseConfig = {
  apiKey: "AIzaSyAG8vYe5WM_3JhXYUj9C6UIrut4FnRBAxU",
  authDomain: "hgbtapp.firebaseapp.com",
  projectId: "hgbtapp",
  storageBucket: "hgbtapp.firebasestorage.app",
  messagingSenderId: "375153203002",
  appId: "1:375153203002:android:d57aea9c9c9cd906372203",
};

const app = initializeApp(firebaseConfig);

// Firebase Web Messaging is only available on web platform
// On native (Android/iOS), use Capacitor Push Notifications instead
let messaging: Messaging | null = null;

if (!Capacitor.isNativePlatform()) {
  try {
    messaging = getMessaging(app);
    console.log("[Firebase] Web messaging initialized");
  } catch (error) {
    console.warn("[Firebase] Could not initialize web messaging:", error);
  }
} else {
  console.log("[Firebase] Native platform detected - using Capacitor Push Notifications");
}

// Wrapper for getToken that handles null messaging
const getToken = async (messagingInstance: Messaging | null, options?: { vapidKey?: string }) => {
  if (!messagingInstance) {
    console.warn("[Firebase] Messaging not available on this platform");
    return null;
  }
  return firebaseGetToken(messagingInstance, options);
};

export { messaging, getToken };