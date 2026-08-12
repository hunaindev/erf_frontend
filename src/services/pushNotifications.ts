import { Capacitor } from "@capacitor/core";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import api from "@/api/Axios";

const PUSH_TOKEN_STORAGE_KEY = "push_notification_token";
const PUSH_TOKEN_SYNCED_USER_KEY = "push_notification_token_synced_user_id";

let listenersAttached = false;

const getStoredPushToken = () => localStorage.getItem(PUSH_TOKEN_STORAGE_KEY);

const getStoredSyncedUserId = () => localStorage.getItem(PUSH_TOKEN_SYNCED_USER_KEY);

const getCurrentUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser || rawUser === "undefined" || rawUser === "null") {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error("Failed to parse current user for push sync:", error);
    return null;
  }
};

const hasAuthToken = () => {
  const rawToken = localStorage.getItem("token");
  return Boolean(rawToken && rawToken !== "undefined" && rawToken !== "null");
};

const persistPushToken = (token: string) => {
  localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
  localStorage.removeItem(PUSH_TOKEN_SYNCED_USER_KEY);
};

const savePushTokenToBackend = async (token: string) => {
  const user = getCurrentUser();

  if (!token || !hasAuthToken() || !user?.id) {
    return;
  }

  if (getStoredSyncedUserId() === String(user.id)) {
    return;
  }

  await api.post("/save-fcm-token", { token });
  localStorage.setItem(PUSH_TOKEN_SYNCED_USER_KEY, String(user.id));
};

const attachPushListeners = () => {
  if (listenersAttached) {
    return;
  }

  PushNotifications.addListener("registration", (token: Token) => {
    console.log("Push token:", token.value);
    persistPushToken(token.value);
    void savePushTokenToBackend(token.value);
  });

  PushNotifications.addListener("registrationError", (error) => {
    console.error("Push registration error:", error);
  });

  PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
    console.log("Push received:", notification);
  });

  PushNotifications.addListener("pushNotificationActionPerformed", (action: ActionPerformed) => {
    console.log("Push action performed:", action);
  });

  listenersAttached = true;
};

export const syncStoredPushTokenToBackend = async () => {
  const token = getStoredPushToken();

  if (!token) {
    return;
  }

  try {
    await savePushTokenToBackend(token);
  } catch (error) {
    console.error("Failed to sync push token to backend:", error);
  }
};

export const initPushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Skipping push registration outside a native Capacitor runtime");
    return;
  }

  attachPushListeners();

  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    console.log("Push permission not granted");
    return;
  }

  await PushNotifications.register();
  await syncStoredPushTokenToBackend();
};
