'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasToolAccess: (toolId: string) => boolean;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const saved = localStorage.getItem('trac_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        // Refresh latest data from server
        fetch(`/api/auth/me?id=${encodeURIComponent(parsed.id)}`)
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              setUser(data.user);
              localStorage.setItem('trac_user_session', JSON.stringify(data.user));
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.error('Session load error', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/auth/me?id=${encodeURIComponent(user.id)}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('trac_user_session', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };

  const login = async (email: string, password = 'default123') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to login' };
      }
      setUser(data.user);
      localStorage.setItem('trac_user_session', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const register = async (name: string, email: string, password = 'default123', phone = '') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to register' };
      }
      setUser(data.user);
      localStorage.setItem('trac_user_session', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const loginWithGoogle = async (customEmailOrCredential?: string, customName?: string) => {
    try {
      let body: any = {};
      
      // If it looks like a Google JWT credential
      if (customEmailOrCredential && customEmailOrCredential.split('.').length === 3) {
        body = { credential: customEmailOrCredential };
      } else if (customEmailOrCredential) {
        const email = customEmailOrCredential.trim().toLowerCase();
        const rawName = customName || (email.includes('@') ? email.split('@')[0].replace('.', ' ') : 'Google User');
        const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        body = {
          email,
          name,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
        };
      } else {
        return { success: false, error: 'Please enter your email or choose a Google account to continue.' };
      }

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Google login failed' };
      }

      setUser(data.user);
      localStorage.setItem('trac_user_session', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Google login error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trac_user_session');
  };

  const hasToolAccess = (toolId: string) => {
    // Free tools are accessible to everyone
    if (['hra-calculator', 'advance-tax-calculator', 'tax-calculator'].includes(toolId)) {
      return true;
    }
    // Admins have access to everything
    if (user?.role === 'admin') {
      return true;
    }
    // All-access pass unlocks all tools
    if (user?.unlockedTools?.includes('all-access-pass')) {
      return true;
    }
    // Check if user has unlocked the tool
    if (user?.unlockedTools?.includes(toolId)) {
      return true;
    }
    // Check localStorage fallback for quick test unlocks
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('trac_test_all_access') === 'true') {
        return true;
      }
      const saved = localStorage.getItem('trac_user_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.unlockedTools?.includes('all-access-pass') || parsed.unlockedTools?.includes(toolId) || parsed.role === 'admin') {
            return true;
          }
        } catch {}
      }
      const direct = localStorage.getItem('trac_unlocked_tools');
      if (direct) {
        try {
          const parsed = JSON.parse(direct);
          if (Array.isArray(parsed) && (parsed.includes(toolId) || parsed.includes('all-access-pass'))) {
            return true;
          }
        } catch {}
      }
    }
    return false;
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        hasToolAccess,
        refreshUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
