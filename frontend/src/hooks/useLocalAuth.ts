import { useEffect, useState } from 'react';

export interface LocalUser {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

const STORAGE_KEY = 'underliv_user';

export function useLocalAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = (name: string, email?: string) => {
    const u: LocalUser = {
      id: Math.random().toString(36).slice(2),
      name: name.trim() || 'Mysterious Laundry Hero',
      email: email?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return { user, login, logout } as const;
}

export function getStoredUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalUser) : null;
  } catch {
    return null;
  }
}
