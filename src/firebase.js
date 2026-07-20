import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

// Firebase Project Credentials for degree-ce3ad
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-DEFAULT_TEST_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "degree-ce3ad.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "degree-ce3ad",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "degree-ce3ad.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "732049102938",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:732049102938:web:a1b2c3d4e5f6g7h8"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Database 'terinn' as configured in Cloud Firestore Console
let firestoreDb;
try {
  firestoreDb = getFirestore(app, "terinn");
} catch (e) {
  try {
    firestoreDb = getFirestore(app);
  } catch (err) {
    console.warn("Firestore init fallback:", err);
  }
}

export const db = firestoreDb;

/**
 * Save an order to both localStorage and Cloud Firestore in real time.
 */
export async function saveOrderToCloud(order) {
  if (!order || !order.id) return;

  // 1. Local Storage Sync
  try {
    const local = JSON.parse(localStorage.getItem('terinn_admin_orders') || '[]');
    const filtered = local.filter(o => o.id !== order.id);
    filtered.unshift(order);
    localStorage.setItem('terinn_admin_orders', JSON.stringify(filtered));
  } catch (e) {
    console.error("Error writing to localStorage:", e);
  }

  // 2. Cloud Firestore Sync
  try {
    if (db) {
      const orderRef = doc(db, "orders", order.id);
      await setDoc(orderRef, {
        ...order,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`Order ${order.id} synced to Cloud Firestore!`);
    }
  } catch (err) {
    console.warn("Firestore write error:", err);
  }
}

/**
 * Fetch an order by ID from local storage OR Cloud Firestore across devices.
 */
export async function fetchOrderFromCloud(searchQuery) {
  if (!searchQuery) return null;
  const queryClean = searchQuery.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Check Local Storage First
  try {
    const local = JSON.parse(localStorage.getItem('terinn_admin_orders') || '[]');
    const match = local.find(o => {
      const oidClean = (o.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return oidClean === queryClean || (queryClean.length >= 4 && oidClean.includes(queryClean));
    });
    if (match) return match;
  } catch (e) { }

  // 2. Query Cloud Firestore
  try {
    if (db) {
      // Try exact doc ID lookup
      const rawId = searchQuery.trim().toUpperCase();
      const docRef = doc(db, "orders", rawId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const orderData = snap.data();
        saveOrderToCloud(orderData); // cache locally
        return orderData;
      }

      // Try searching all orders in collection
      const collRef = collection(db, "orders");
      const querySnap = await getDocs(collRef);
      let cloudMatch = null;

      querySnap.forEach(docSnap => {
        const data = docSnap.data();
        const oidClean = (data.id || docSnap.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (oidClean === queryClean || (queryClean.length >= 4 && oidClean.includes(queryClean))) {
          cloudMatch = data;
        }
      });

      if (cloudMatch) {
        saveOrderToCloud(cloudMatch); // cache locally
        return cloudMatch;
      }
    }
  } catch (err) {
    console.warn("Firestore query error:", err);
  }

  return null;
}
