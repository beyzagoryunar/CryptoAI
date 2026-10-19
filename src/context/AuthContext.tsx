import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDto } from '../services/api/types';
import { cryptoService } from '../services/api/cryptoService';
import { mockUser } from '../services/api/mockData';

const SESSION_DURATION_DAYS = 30;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;
const STORAGE_KEY = '@cryptoai_auth_user';

interface StoredSession {
  user: UserDto;
  token: string;
  sessionExpiresAt: number;
}

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionDaysRemaining: number;
  sessionExpiryDate: string;
  login: (email: string, pass: string) => Promise<void>;
  register: (fName: string, lName: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(mockUser);
  const [token, setToken] = useState<string | null>('jwt_mock_token');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number>(
    Date.now() + SESSION_DURATION_MS
  );

  useEffect(() => {
    loadStoredSession();
  }, []);

  const calculateDaysRemaining = (expiryTime: number) => {
    const diff = expiryTime - Date.now();
    if (diff <= 0) return 0;
    return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  const loadStoredSession = async () => {
    try {
      const storedStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedStr) {
        const stored: StoredSession = JSON.parse(storedStr);
        if (stored.sessionExpiresAt && Date.now() > stored.sessionExpiresAt) {
          // 30 günlük oturum süresi dolmuş
          await logout();
          return;
        }
        setUser(stored.user);
        setToken(stored.token);
        if (stored.sessionExpiresAt) {
          setSessionExpiresAt(stored.sessionExpiresAt);
        }
      }
    } catch {
      // Hata durumunda varsayılan oturum korunur
    }
  };

  const saveSession = async (userData: UserDto, jwtToken: string, expiryTime: number) => {
    setUser(userData);
    setToken(jwtToken);
    setSessionExpiresAt(expiryTime);
    const sessionData: StoredSession = {
      user: userData,
      token: jwtToken,
      sessionExpiresAt: expiryTime,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await cryptoService.login(email, pass);
      const expiry = Date.now() + SESSION_DURATION_MS;
      await saveSession(res.user, res.token, expiry);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fName: string, lName: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await cryptoService.register(fName, lName, email, pass);
      const expiry = Date.now() + SESSION_DURATION_MS;
      await saveSession(res.user, res.token, expiry);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    if (user && token) {
      const newExpiry = Date.now() + SESSION_DURATION_MS;
      await saveSession(user, token, newExpiry);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const daysRemaining = calculateDaysRemaining(sessionExpiresAt);
  const formattedExpiryDate = new Date(sessionExpiresAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        sessionDaysRemaining: daysRemaining,
        sessionExpiryDate: formattedExpiryDate,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
