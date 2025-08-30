"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "@/lib/types";

const useMockAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all users once to simulate auth checking
  const [allUsers, setAllUsers] = useState<User[]>([]);
  useEffect(() => {
    async function fetchUsers() {
      // In a real app, you'd have an API endpoint for this.
      const res = await fetch('/api/users?all=true');
      const data = await res.json();
      setAllUsers(data.users);
    }
    fetchUsers();
  }, [])


  useEffect(() => {
    if (allUsers.length === 0) {
       // if we have no users, we're not done loading
       setLoading(true);
       return; 
    }
    try {
      const storedEmail = localStorage.getItem("loggedInUser");
      if (storedEmail) {
        const currentUser = allUsers.find((u) => u.email === storedEmail);
        setUser(currentUser || null);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
    } finally {
      setLoading(false);
    }
  }, [allUsers]);

  const login = useCallback(
    (email: string) => {
      if (allUsers.length === 0) return;
      const userToLogin = allUsers.find((u) => u.email === email);
      if (userToLogin) {
        try {
          localStorage.setItem("loggedInUser", email);
          setUser(userToLogin);
          if (userToLogin.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Could not access localStorage", error);
        }
      }
      return userToLogin;
    },
    [router, allUsers]
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
      
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem("loggedInUser") : null;
      
      if (!storedEmail) {
        router.replace("/");
        return;
      }
      
      const currentUser = allUsers.find((u) => u.email === storedEmail);
      if (!currentUser || (role && currentUser.role !== role)) {
        router.replace("/");
      }
    },
    [router, loading, allUsers]
  );

  return { user, loading, login, logout, checkAuth };
};

export default useMockAuth;
