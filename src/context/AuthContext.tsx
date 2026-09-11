import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '../types';

// ----------------------------------------------------------------
// Hardcoded credential store (mock authentication)
// ----------------------------------------------------------------
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@horizon.com': {
    password: 'admin123',
    user: {
      id: 'usr_admin_001',
      name: 'Horizon Admin',
      email: 'admin@horizon.com',
      role: 'ADMIN',
      unitNumber: 'OFFICE',
    },
  },
  'user@horizon.com': {
    password: 'user123',
    user: {
      id: 'usr_res_001',
      name: 'Alex Resident',
      email: 'user@horizon.com',
      role: 'RESIDENT',
      unitNumber: 'B-204',
    },
  },
};

const STORAGE_KEY = '@horizon:user';

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate persisted session on mount
  useEffect(() => {
    const rehydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUser(JSON.parse(raw) as User);
        }
      } catch (e) {
        console.warn('[AuthContext] Failed to rehydrate session', e);
      } finally {
        setIsLoading(false);
      }
    };
    rehydrate();
  }, []);

  /**
   * Authenticate with email/password against the mock store.
   * Returns true on success, false on invalid credentials.
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate network round-trip
      await new Promise(r => setTimeout(r, 800));

      const entry = MOCK_USERS[email.trim().toLowerCase()];
      if (!entry || entry.password !== password) {
        return false;
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
      setUser(entry.user);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  /** Clear session and persisted token */
  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------------------------------------------------
// Custom hook
// ----------------------------------------------------------------
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
