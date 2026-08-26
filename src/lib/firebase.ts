import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { 
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Safe app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */

// Safe Auth Initialization: Use standard getAuth which gracefully handles sandbox/iframe storage blocks.
let firebaseAuth: any;
try {
  firebaseAuth = getAuth(app);
} catch (error: any) {
  console.error("Firebase getAuth(app) failed, trying standard getAuth() fallback:", error);
  try {
    firebaseAuth = getAuth();
  } catch (fallbackError: any) {
    console.error("FATAL: All Firebase Auth initialization methods failed:", fallbackError);
  }
}

export const auth = firebaseAuth;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Re-export standard Firestore methods directly so no simulated wrappers exist
export {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  runTransaction,
};

export async function secureConsumeCredits(cost: number): Promise<string> {
  const currentUser = auth?.currentUser;
  if (!currentUser) throw new Error("No active user session.");
  
  try {
    const idToken = await currentUser.getIdToken();
    const resp = await fetch("/api/consume-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, cost })
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.transactionId;
    }
    const errData = await resp.json().catch(() => ({}));
    if (errData.error && errData.error.includes("Insufficient credits")) {
      throw new Error(errData.error);
    }
  } catch (err: any) {
    if (err.message && err.message.includes("Insufficient")) {
      throw err;
    }
    console.warn("[KRON SDK] Server credit deduction failed, running client-side fallback:", err);
  }

  // Fallback transaction
  const coinsRef = doc(db, "user_coins", currentUser.uid);
  const transactionId = "tx_client_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(coinsRef);
    if (!snap.exists()) {
      throw new Error("User coins document not found.");
    }
    const d = snap.data();
    const currentCoins = d.coins ?? 150;
    if (currentCoins < cost) {
      throw new Error(`Insufficient credits. Required: ${cost}, Available: ${currentCoins}`);
    }
    transaction.update(coinsRef, {
      coins: currentCoins - cost
    });
  });
  return transactionId;
}

export async function secureRefundCredits(transactionId: string, cost?: number): Promise<void> {
  const currentUser = auth?.currentUser;
  if (!currentUser) return;

  try {
    const idToken = await currentUser.getIdToken();
    const resp = await fetch("/api/refund-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, transactionId })
    });
    if (resp.ok) return;
  } catch (err) {
    console.warn("[KRON SDK] Server refund failed, running client-side fallback:", err);
  }

  // Fallback transaction
  if (cost && cost > 0) {
    const coinsRef = doc(db, "user_coins", currentUser.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(coinsRef);
        if (snap.exists()) {
          const d = snap.data();
          const currentCoins = d.coins ?? 150;
          transaction.update(coinsRef, {
            coins: currentCoins + cost
          });
        }
      });
    } catch (refundErr) {
      console.error("[KRON SDK] Client-side refund transaction failed:", refundErr);
    }
  }
}


