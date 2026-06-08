import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as dbSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  auth, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "@/src/lib/firebase";
import { toast } from "sonner";

export interface CustomUser {
  id: string;
  uid: string;
  email: string | null;
  emailVerified: boolean;
  photoURL?: string | null;
}

type AuthContextType = {
  session: any;
  user: CustomUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  sendPasswordReset: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync user metadata (and standard KRON Coins) in Firestore when signing in/up
  const syncUserMetadataAndCoins = async (fUser: any) => {
    try {
      const userRef = doc(db, "user_coins", fUser.uid);
      const userSnap = await getDoc(userRef);
      const isAdminEmail = fUser.email === "starbruce91@gmail.com";

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          id: fUser.uid,
          user_id: fUser.uid,
          email: fUser.email || "",
          user_email: fUser.email || "",
          coins: isAdminEmail ? 150000 : 150, // 150 Free credits daily as requested
          plan: isAdminEmail ? "pro_creator" : "free",
          plan_status: "active",
          last_reset_time: Date.now(),
          referral_count: 0,
          referred_emails: [],
          is_admin: isAdminEmail,
          created_at: serverTimestamp(),
        });

        // Capture url-based referral at user signup time
        const storedReferrerId = localStorage.getItem("kron_referrer_id");
        if (storedReferrerId && storedReferrerId !== fUser.uid) {
          try {
            const referrerRef = doc(db, "user_coins", storedReferrerId);
            const referrerSnap = await getDoc(referrerRef);
            if (referrerSnap.exists()) {
              const referralRef = doc(db, "referrals", "ref_" + fUser.uid);
              await setDoc(referralRef, {
                id: "ref_" + fUser.uid,
                referrer_id: storedReferrerId,
                referred_user_id: fUser.uid,
                referred_email: fUser.email || "",
                status: "pending",
                created_at: serverTimestamp()
              });
              console.log("[useAuth] Created pending referral trace for referrer: " + storedReferrerId);
            }
          } catch (refErr) {
            console.warn("[useAuth] Failed to establish database referral link:", refErr);
          }
        }
      } else {
        const snapData = userSnap.data();
        const updatePayload: any = {};
        if (!snapData.email || !snapData.user_email) {
          updatePayload.email = fUser.email || "";
          updatePayload.user_email = fUser.email || "";
        }
        if (isAdminEmail && (!snapData.is_admin || (snapData.coins ?? 0) < 100000)) {
          updatePayload.is_admin = true;
          updatePayload.coins = Math.max(snapData.coins ?? 0, 150000);
          updatePayload.plan = "pro_creator";
          updatePayload.plan_status = "active";
        }
        if (Object.keys(updatePayload).length > 0) {
          await setDoc(userRef, updatePayload, { merge: true });
        }
      }
    } catch (e) {
      console.warn("User coins synchronization warning:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const compatUser: CustomUser = {
          id: currentUser.uid,
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified,
          photoURL: currentUser.photoURL,
        };
        setUser(compatUser);
        setSession(compatUser);
        await syncUserMetadataAndCoins(compatUser);
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      toast.success("Successfully logged in with Google! Sign-in successful.");
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    toast.success("Welcome back! Sign-in successful.");
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
    toast.success("Account created successfully! Welcome & Sign-in successful.");
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent! Check your inbox.");
  };

  const signOut = async () => {
    try {
      await dbSignOut(auth);
    } catch (e) {
      console.warn("Sign out err:", e);
    }
    setUser(null);
    setSession(null);
    toast.success("Signed out successfully");
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signOut, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail,
      sendPasswordReset,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
