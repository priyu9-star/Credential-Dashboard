
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "@/lib/types";

const useMockAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users?all=true');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setAllUsers(data.users || []);
      return data.users || [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setAllUsers([]); // Ensure allUsers is an empty array on error
      return [];
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const users = await fetchUsers();
      try {
        const storedUserId = localStorage.getItem("loggedInUser");
        if (storedUserId) {
          const currentUser = users.find((u: User) => u.id === storedUserId);
          setUser(currentUser || null);
        }
      } catch (error) {
        console.error("Could not access localStorage", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUsers]);

  const login = useCallback(
    async (email: string, password?: string) => {
      let userToLogin = allUsers.find((u) => u.email === email && u.password === password);

      if (!userToLogin) {
        const freshUsers = await fetchUsers();
        userToLogin = freshUsers.find((u: User) => u.email === email && u.password === password);
      }

      if (userToLogin) {
        try {
          localStorage.setItem("loggedInUser", userToLogin.id);
          setUser(userToLogin);
          if (userToLogin.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Could not access localStorage", error);
        }
        return userToLogin;
      }
      
      // Explicitly return null if login fails
      return null;
    },
    [router, allUsers, fetchUsers]
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("loggedInUser");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Could not access localStorage", error);
    }
  }, [router]);

  const checkAuth = useCallback(
    (role?: UserRole) => {
      if (loading) return; 
      
      const storedUserId = typeof window !== 'undefined' ? localStorage.getItem("loggedInUser") : null;
      
      if (!storedUserId) {
        router.replace("/");
        return;
      }
      
      const currentUser = allUsers.find((u) => u.id === storedUserId);
      if (!currentUser || (role && currentUser.role !== role)) {
         logout();
      }
    },
    [router, loading, allUsers, logout]
  );

  return { user, loading, login, logout, checkAuth };
};

export default useMockAuth;
