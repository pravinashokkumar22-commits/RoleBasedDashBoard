import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthContextType, AuthPayload } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

// Decode JWT payload into typed object, or return null on failure
function decodeToken(token: string): AuthPayload | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.id && payload?.role ? (payload as AuthPayload) : null;
  } catch {
    return null;
  }
}

function isExpired(payload: AuthPayload): boolean {
  return !!payload.exp && Date.now() >= payload.exp * 1000;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore token from storage if still valid
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded && !isExpired(decoded)) {
        setToken(stored);
        setUser(decoded);
      } else {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string) => {
    const decoded = decodeToken(newToken);
    if (!decoded || isExpired(decoded)) return console.error('Invalid or expired token');
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(decoded);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Auto-logout when token expires (checked every 60s)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => { if (isExpired(user)) logout(); }, 60_000);
    return () => clearInterval(interval);
  }, [user, logout]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === 'admin',
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
