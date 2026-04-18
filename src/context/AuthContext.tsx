"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logout as logoutApi } from '../api/api';
import type { Member } from '../types';

interface AuthContextType {
  member: Member | null;
  loading: boolean;
  refreshMember: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  member: null,
  loading: true,
  refreshMember: async () => { },
  logout: async () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedMember = localStorage.getItem('auth_member');
      return savedMember ? JSON.parse(savedMember) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const refreshMember = useCallback(async () => {
    try {
      const memberData = await getMe();
      setMember(memberData);
      if (memberData.isLoggedIn) {
        localStorage.setItem('auth_member', JSON.stringify(memberData));
      } else {
        localStorage.removeItem('auth_member');
      }
    } catch (error) {
      console.error('Failed to get member:', error);
      setMember(null);
      localStorage.removeItem('auth_member');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setMember(null);
      localStorage.removeItem('auth_member');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      await refreshMember();
      if (isMounted) {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [refreshMember]);

  return (
    <AuthContext.Provider value={{ member, loading, refreshMember, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);