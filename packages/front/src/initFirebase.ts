import { initializeApp, deleteApp, FirebaseApp } from "firebase/app";
import { createContext, useEffect, useState } from "react";
import debug from "debug";

export function initFirebase() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
  return initializeApp(firebaseConfig);
}

const log = debug("lootroll:useFirebase");
export function useFirebase() {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  useEffect(() => {
    log("initializing firebase...");
    const app = initFirebase();
    setApp(app);
    log("firebase initialized, %o", { app });
    return () => {
      deleteApp(app);
      setApp(null);
      log("firebase deleted");
    };
  }, []);
  return { app };
}

export const FirebaseContext = createContext<FirebaseApp | null>(null);
