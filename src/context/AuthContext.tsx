import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDto } from '../services/api/types';
import { cryptoService } from '../services/api/cryptoService';
import { mockUser } from '../services/api/mockData';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (fName: string, lName: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const STORAGE_KEY = '@cryptoai_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Varsayılan olarak mock kullanıcı aktif başlasın (ekranları doğrudan görebilmek için)
  const [user, setUser] = useState<UserDto | null>(mockUser);
  const [token, setToken] = useState<string | null>('jwt_mock_token');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch {
      // Hata durumunda varsayılan oturum korunur
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await cryptoService.login(email, pass);
      setUser(res.user);
      setToken(res.token);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fName: string, lName: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await cryptoService.register(fName, lName, email, pass);
      setUser(res.user);
      setToken(res.token);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
