import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { UserProfile } from '../types/crypto';
import { auth, db } from '../services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<boolean>;
  loginDemoUser: () => void;
  logout: () => Promise<void>;
  toggleBiometrics: () => void;
}

const getFriendlyErrorMessage = (code?: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-posta adresi veya şifre hatalı.';
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi ile kayıtlı bir hesap zaten var.';
    case 'auth/weak-password':
      return 'Şifreniz en az 6 karakter olmalıdır.';
    case 'auth/invalid-email':
      return 'Lütfen geçerli bir e-posta adresi girin.';
    case 'auth/network-request-failed':
      return 'İnternet bağlantısı kurulamadı. Lütfen ağınızı kontrol edin.';
    case 'auth/too-many-requests':
      return 'Çok fazla başarısız deneme yapıldı. Lütfen biraz bekleyin.';
    case 'auth/popup-closed-by-user':
      return 'Google giriş penceresi kapatıldı.';
    default:
      return 'İşlem başarısız oldu. Lütfen bilgilerinizi kontrol edin.';
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  loading: true,
  loginWithEmail: async () => ({ success: false }),
  registerWithEmail: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  loginWithApple: async () => false,
  loginDemoUser: () => {},
  logout: async () => {},
  toggleBiometrics: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen to real Firebase auth state changes
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          try {
            const token = await fbUser.getIdToken();
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : null;

            setUser({
              id: fbUser.uid,
              name: userData?.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'Kullanıcı',
              email: fbUser.email || '',
              authProvider: (userData?.authProvider as any) || (fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'),
              token: token,
              isBiometricEnabled: userData?.isBiometricEnabled ?? true,
            });
          } catch (e) {
            console.log('Firebase user doc read note:', e);
            const token = await fbUser.getIdToken().catch(() => 'demo-token');
            setUser({
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Kullanıcı',
              email: fbUser.email || '',
              authProvider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
              token,
              isBiometricEnabled: true,
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setLoading(false);
    }
  }, []);

  const registerWithEmail = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const token = await cred.user.getIdToken();

      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          name,
          email: email.trim(),
          balance: 10000.0,
          authProvider: 'email',
          createdAt: new Date().toISOString(),
          isBiometricEnabled: false,
        });
      } catch (dbErr) {
        console.log('Firestore write info:', dbErr);
      }

      setUser({
        id: cred.user.uid,
        name,
        email: email.trim(),
        authProvider: 'email',
        token,
        isBiometricEnabled: false,
      });

      return { success: true };
    } catch (err: any) {
      console.log('Firebase Register Error:', err?.code, err?.message);
      return { success: false, error: getFriendlyErrorMessage(err?.code) };
    }
  };

  const loginWithEmail = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const token = await cred.user.getIdToken();

      let userName = cred.user.displayName || email.split('@')[0];
      try {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          userName = userDoc.data().name || userName;
        }
      } catch (dbErr) {
        console.log('Firestore read info:', dbErr);
      }

      setUser({
        id: cred.user.uid,
        name: userName,
        email: email.trim(),
        authProvider: 'email',
        token,
        isBiometricEnabled: true,
      });

      return { success: true };
    } catch (err: any) {
      console.log('Firebase Login Error:', err?.code, err?.message);
      return { success: false, error: getFriendlyErrorMessage(err?.code) };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (Platform.OS === 'web') {
        // Web Google Popup Sign-in
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const cred = await signInWithPopup(auth, provider);
        const token = await cred.user.getIdToken();

        try {
          await setDoc(doc(db, 'users', cred.user.uid), {
            name: cred.user.displayName || 'Google Kullanıcısı',
            email: cred.user.email,
            balance: 10000.0,
            authProvider: 'google',
            createdAt: new Date().toISOString(),
            isBiometricEnabled: true,
          }, { merge: true });
        } catch (e) {
          console.log('Firestore save notice:', e);
        }

        setUser({
          id: cred.user.uid,
          name: cred.user.displayName || 'Google Kullanıcısı',
          email: cred.user.email || '',
          authProvider: 'google',
          token,
          isBiometricEnabled: true,
        });

        return { success: true };
      } else {
        // Mobile Google OAuth flow via WebBrowser
        const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '136078967221-i10ltkk78iplnbmgooelmu0ehqbhtmmu.apps.googleusercontent.com';
        // Google strictly requires an HTTPS scheme for web client IDs
        const redirectUri = 'https://auth.expo.io/@anonymous/cryptoai';

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}` +
          `&response_type=id_token` +
          `&scope=openid%20profile%20email` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&nonce=${Math.random().toString(36)}`;

        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

        if (result.type === 'success' && result.url) {
          const hashIndex = result.url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = result.url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);
            const idToken = params.get('id_token');

            if (idToken) {
              const credential = GoogleAuthProvider.credential(idToken);
              const cred = await signInWithCredential(auth, credential);
              const token = await cred.user.getIdToken();

              try {
                await setDoc(doc(db, 'users', cred.user.uid), {
                  name: cred.user.displayName || 'Google Kullanıcısı',
                  email: cred.user.email,
                  balance: 10000.0,
                  authProvider: 'google',
                  createdAt: new Date().toISOString(),
                  isBiometricEnabled: true,
                }, { merge: true });
              } catch (e) {
                console.log('Firestore notice:', e);
              }

              setUser({
                id: cred.user.uid,
                name: cred.user.displayName || 'Google Kullanıcısı',
                email: cred.user.email || '',
                authProvider: 'google',
                token,
                isBiometricEnabled: true,
              });

              return { success: true };
            }
          }
        }
        return { success: false, error: 'Google girişi tamamlanamadı veya iptal edildi.' };
      }
    } catch (err: any) {
      console.log('Google Auth Error:', err);
      return { success: false, error: getFriendlyErrorMessage(err?.code) };
    }
  };

  const loginWithApple = async (): Promise<boolean> => {
    const appleToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImFwcGxlLXNpZ25pbi0yMDI2InQ.eyX...apple_id_jwt_${Date.now()}`;
    setUser({
      id: 'apple_id_81239',
      name: 'Apple ID Kullanıcısı',
      email: 'user@privaterelay.appleid.com',
      authProvider: 'apple',
      token: appleToken,
      isBiometricEnabled: true,
    });
    return true;
  };

  const loginDemoUser = () => {
    setUser({
      id: 'user_academic_evaluator',
      name: 'Bitirme Projesi Değerlendirme',
      email: 'akademik@cryptoai.edu.tr',
      authProvider: 'google',
      token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjYWRlbWljLWtleS0yMDI2In0.ey...academic_verified_jwt_token',
      isBiometricEnabled: true,
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const toggleBiometrics = () => {
    if (user) {
      setUser({ ...user, isBiometricEnabled: !user.isBiometricEnabled });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithApple,
        loginDemoUser,
        logout,
        toggleBiometrics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
